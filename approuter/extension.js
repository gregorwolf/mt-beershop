const axios = require("axios");
const crypto = require("crypto");
const qs = require("qs");
const xsenv = require("@sap/xsenv");
const { verifyJwt } = require("@sap-cloud-sdk/core");

xsenv.loadEnv();
const { xsuaa } = xsenv.getServices({
  xsuaa: { tags: "xsuaa" },
});
// console.log("XSUAA:", xsuaa);

function getTenant(req) {
  if (process.env.TENANT_HOST_PATTERN) {
    // for multitenant apps let's get the tenant domain
    var re = new RegExp(process.env.TENANT_HOST_PATTERN);
    const tenant = re.exec(req.headers.host);
    if (!Array.isArray(tenant)) {
      throw Error("no matching tenant found");
    }
    return tenant[1];
  } else {
    return false;
  }
}

const jwtCache = {};

function getBasicAuthCredentials(req) {
  const [method, base64Credentials] = req.headers.authorization.split(" ");
  if (method !== "Basic") {
    throw Error("request does not use basic authentication");
  }
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  let hash = crypto.createHash("sha256").update(credentials).digest("base64");
  const tenant = getTenant(req);
  if (tenant) {
    hash = tenant + "-" + hash;
  }
  return { username, password, hash };
}

async function getJWT(req, credentials) {
  let jwt = "";
  // For single tenant apps we use the xsuaa URL
  let authURL = xsuaa.url;
  let loginHint = '{"origin":"sap.custom"}';
  if (process.env.LOGIN_HINT_ORIGIN) {
    loginHint = `{"origin":"${process.env.LOGIN_HINT_ORIGIN}"}`;
  }
  if (process.env.TENANT_HOST_PATTERN) {
    let tenant = getTenant(req);
    authURL = `https://${tenant}.${xsuaa.uaadomain}/oauth/token`;
  }

  const auth = {
    username: xsuaa.clientid,
    password: xsuaa.clientsecret,
  };
  const parameters = {
    grant_type: "password",
    username: credentials.username,
    password: credentials.password,
    client_id: xsuaa.clientid,
    response_type: "token",
    login_hint: loginHint,
  };
  let response;
  try {
    response = await axios({
      method: "POST",
      url: authURL,
      auth: auth,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(parameters),
    });
  } catch (error) {
    throw error;
  }
  return response.data.access_token;
}

async function setApprouterAuthorization(req, credentials, next) {
  // read JWT from cache
  let jwt;
  let cachedJwt = jwtCache[credentials.hash];
  if (cachedJwt) {
    const verifiedJwt = await verifyJwt(cachedJwt.jwt);
    if (!verifiedJwt) {
      throw Error("JWT could not be verified");
    }
    // Check if cache is still valid
    const now = Math.round(new Date().getTime() / 1000);
    if (verifiedJwt.exp >= now) {
      jwt = cachedJwt.jwt;
    } else {
      jwt = false;
    }
  }
  if (jwt) {
    req.headers["x-approuter-authorization"] = `Bearer ${jwt}`;
    next();
  } else {
    // Get JWT
    jwt = await getJWT(req, credentials);
    // Set x-approuter-authorization header
    if (jwt) {
      // Cache JWT
      jwtCache[credentials.hash] = {
        jwt,
        created: new Date().getTime(),
      };
      req.headers["x-approuter-authorization"] = `Bearer ${jwt}`;
    }
    next();
  }
}

module.exports = {
  insertMiddleware: {
    first: [
      function logRequest(req, res, next) {
        // Client has provided a JWT in this special header
        // https://github.com/gregorwolf/SAP-NPM-API-collection/tree/main/apis/approuter#service-to-application-router
        if (req.headers["x-approuter-authorization"]) {
          next();
        }
        if (req.headers.authorization) {
          // Check if Basic Authorization is provided
          const credentials = getBasicAuthCredentials(req);
          setApprouterAuthorization(req, credentials, next).then(() => {});
        } else {
          next();
        }
      },
    ],
    beforeRequestHandler: [
      {
        path: "/extension",
        handler: function myMiddleware(req, res, next) {
          if (!req.headers.authorization) {
            res.setHeader(
              "WWW-Authenticate",
              'Basic realm="Approuter Basic Auth", charset="UTF-8"'
            );
            res.statusCode = 401;
            res.end("Unauthorized");
            console.log("### DEBUG ### No authorization header provided");
            return;
          }
          console.log(req.headers.authorization);
          res.end("### DEBUG ### Request handled by basic-auth extension");
        },
      },
    ],
  },
};

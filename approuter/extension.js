const axios = require("axios");
const crypto = require("crypto");
const qs = require("qs");
const xsenv = require("@sap/xsenv");

xsenv.loadEnv();
const { xsuaa } = xsenv.getServices({
  xsuaa: { tags: "xsuaa" },
});

// console.log("XSUAA:", xsuaa);

const jwtCache = {};

const destination = {
  url: "https://mt-backend",
  authentication: "OAuth2Password",
  clientId: xsuaa.clientid,
  clientSecret: xsuaa.clientsecret,
  type: "HTTP",
  queryParameters: {
    login_hint: '{"origin":"sap.custom"}',
  },
};

function getBasicAuthCredentials(req) {
  const [method, base64Credentials] = req.headers.authorization.split(" ");
  if (method !== "Basic") {
    throw Error("request does not use basic authentication");
  }
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");
  const hash = crypto.createHash("sha256").update(credentials).digest("base64");
  return { username, password, hash };
}

async function getJWT(req, credentials) {
  let jwt = "";
  // Add dynamic parts to destination
  if (!process.env.TENANT_HOST_PATTERN) {
    throw Error("TENANT_HOST_PATTERN is not defined");
  }
  var re = new RegExp(process.env.TENANT_HOST_PATTERN);
  const tenant = re.exec(req.headers.host);
  if (!tenant[1]) {
    throw Error("no matching tenant found");
  }
  destination.tokenServiceUrl = `https://${tenant[1]}.${xsuaa.uaadomain}/oauth/token`;
  destination.name = credentials.username;
  destination.username = credentials.username;
  destination.password = credentials.password;
  const auth = {
    username: destination.clientId,
    password: destination.clientSecret,
  };
  const parameters = {
    grant_type: "password",
    username: destination.username,
    password: destination.password,
    client_id: destination.clientId,
    response_type: "token",
    login_hint: destination.queryParameters.login_hint,
  };
  let response;
  try {
    response = await axios({
      method: "POST",
      url: destination.tokenServiceUrl,
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

module.exports = {
  insertMiddleware: {
    first: [
      function logRequest(req, res, next) {
        console.log("### DEBUG ### Got request %s %s", req.method, req.url);
        if (req.headers.authorization) {
          // Check if Basic Authorization is provided
          const credentials = getBasicAuthCredentials(req);
          // console.log(credentials);
          // read JWT from cache
          if (jwtCache[credentials.hash]) {
            req.headers["x-approuter-authorization"] = `Bearer ${
              jwtCache[credentials.hash]
            }`;
            next();
          } else {
            // Get JWT
            getJWT(req, credentials).then((jwt) => {
              // Set x-approuter-authorization header
              if (jwt) {
                // Cache JWT
                jwtCache[credentials.hash] = jwt;
                req.headers["x-approuter-authorization"] = `Bearer ${jwt}`;
              }
              next();
            });
          }
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

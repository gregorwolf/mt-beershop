const cds = require("@sap/cds");
const {
  executeHttpRequest,
  getDestinationFromDestinationService,
  retrieveJwt,
  verifyJwt,
} = require("@sap-cloud-sdk/core");
const { getDestinationNameAndJwt } = require("./lib/connection-helper");
const { getOrganizations } = require("./cf-api");

async function decodeJwt(req) {
  let jwt = retrieveJwt(req);
  if (jwt) {
    return await verifyJwt(jwt);
  } else {
    return false;
  }
}

module.exports = cds.service.impl(async function () {
  this.on("READ", "Suppliers", async (req) => {
    const bupa = await cds.connect.to("EPM_REF_APPS_PROD_MAN_SRV");
    return bupa.run(req.query);
  });
  this.on("READ", "SdkSuppliers", async (req) => {
    let decodedJwt = await decodeJwt(req);
    if (decodedJwt) {
      console.log("decodedJwt: ", decodedJwt);
      const options = {
        iss: decodedJwt.iss,
      };
      const destination = await getDestinationFromDestinationService(
        "S4HANA",
        options
      );
      const response = await executeHttpRequest(destination, {
        method: "get",
        url: "/sap/opu/odata/sap/EPM_REF_APPS_PROD_MAN_SRV/Suppliers?$top=2&$select=Id,Name",
      });
      return response.data.d.results;
    } else {
      req.error({ code: 404, msg: "No valid JWT provided" });
    }
  });

  this.on("READ", "SdkJwtSuppliers", async (req) => {
    const destinationNameAndJwt = getDestinationNameAndJwt(req, "S4HANA");
    console.log("destinationNameAndJwt: ", destinationNameAndJwt);
    const response = await executeHttpRequest(destinationNameAndJwt, {
      method: "get",
      url: "/sap/opu/odata/sap/EPM_REF_APPS_PROD_MAN_SRV/Suppliers?$top=2&$select=Id,Name",
    });
    return response.data.d.results;
  });

  this.on("READ", "UserScopes", async (req) => {
    let user = {
      username: req.user.id,
      is_admin: req.user.is("admin"),
    };
    let decodedJwt = await decodeJwt(req);
    if (decodedJwt) {
      user = {
        ...user,
        email: decodedJwt.email,
        firstname: decodedJwt.given_name,
        lastname: decodedJwt.family_name,
      };
    }
    if (req.user.tenant) {
      user.tenant = req.user.tenant;
    }
    const users = [user];
    users.$count = 1;
    return users;
  });

  this.on("SDKgetOrganizations", (req) => {
    return getOrganizations(req);
  });

  this.on("getOrganizations", async (req) => {
    const cfapi = await cds.connect.to("cfapi");
    return cfapi.get("/v3/organizations");
  });
});

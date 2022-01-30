const cds = require("@sap/cds");
const {
  executeHttpRequest,
  retrieveJwt,
  verifyJwt,
} = require("@sap-cloud-sdk/core");
const { getDestinationNameAndJwt } = require("./lib/connection-helper");
const { getOrganizations } = require("./cf-api");

module.exports = cds.service.impl(async function () {
  this.on("READ", "Suppliers", async (req) => {
    const bupa = await cds.connect.to("EPM_REF_APPS_PROD_MAN_SRV");
    return bupa.run(req.query);
  });
  this.on("READ", "SdkSuppliers", async (req) => {
    const response = await executeHttpRequest(
      getDestinationNameAndJwt(req, "S4HANA"),
      {
        method: "get",
        url: "/sap/opu/odata/sap/EPM_REF_APPS_PROD_MAN_SRV/Suppliers?$top=2&$select=Id,Name",
      }
    );
    return response.data.d.results;
  });

  this.on("READ", "UserScopes", async (req) => {
    let user = {
      username: req.user.id,
      is_admin: req.user.is("admin"),
    };
    let jwt = retrieveJwt(req);
    if (jwt) {
      let decodedJwt = await verifyJwt(jwt);
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

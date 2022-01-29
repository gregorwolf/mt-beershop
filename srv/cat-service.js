const cds = require("@sap/cds");
const { retrieveJwt, verifyJwt } = require("@sap-cloud-sdk/core");
const { getOrganizations } = require("./cf-api");

module.exports = cds.service.impl(async function () {
  const bupa = await cds.connect.to("EPM_REF_APPS_PROD_MAN_SRV");

  this.on("READ", "Suppliers", (req) => {
    return bupa.run(req.query);
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
    const users = [user];
    users.$count = 1;
    return users;
  });

  this.on("SDKgetOrganizations", () => {
    return getOrganizations();
  });

  this.on("getOrganizations", async () => {
    const cfapi = await cds.connect.to("cfapi");
    return cfapi.get("/v3/organizations");
  });
});

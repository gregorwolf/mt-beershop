const { getDestinationNameAndJwt } = require("./lib/connection-helper");
const { executeHttpRequest } = require("@sap-cloud-sdk/core");

const destinationName = process.env.CFAPI_DESTINATION || "CFAPI";
async function getOrganizations(req) {
  const response = await executeHttpRequest(
    getDestinationNameAndJwt(req, destinationName),
    {
      method: "get",
      url: "/v3/organizations",
    }
  );
  return response.data;
}

module.exports = { getOrganizations };

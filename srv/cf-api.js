const { getDestinationNameAndJwt } = require("./lib/connection-helper");
const { executeHttpRequest } = require("@sap-cloud-sdk/core");

const destinationName = process.env.CFAPI_DESTINATION || "CFAPI";
async function getOrganizations(req) {
  const destinationNameAndJwt = getDestinationNameAndJwt(req, destinationName);
  console.log("destinationNameAndJwt: ", destinationNameAndJwt);
  const response = await executeHttpRequest(destinationNameAndJwt, {
    method: "get",
    url: "/v3/organizations",
  });
  return response.data;
}

module.exports = { getOrganizations };

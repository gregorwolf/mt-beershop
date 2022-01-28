const { executeHttpRequest } = require("@sap-cloud-sdk/core");

const destination = {
  destinationName: process.env.CFAPI_DESTINATION || "CFAPI",
};

async function getOrganizations() {
  const response = await executeHttpRequest(destination, {
    method: "get",
    url: "/v3/organizations",
  });
  return response.data;
}

module.exports = { getOrganizations };

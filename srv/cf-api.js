const { getDestinationNameAndJwt } = require("./lib/connection-helper");
const {
  getDestinationFromDestinationService,
} = require("@sap-cloud-sdk/connectivity");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");

const destinationName = process.env.CFAPI_DESTINATION || "CFAPI";
const options = {
  // CSW Partner
  iss: "https://csw-dev-azure.authentication.eu20.hana.ondemand.com/oauth/token",
  // Gregor Wolf Trial
  //iss: "https://60714212trial.authentication.us10.hana.ondemand.com/oauth/token",
};

async function getCFAPIdestination() {
  return getDestinationFromDestinationService(destinationName, options);
}

async function getOrganizations(req) {
  const destinationNameAndJwt = getDestinationNameAndJwt(req, destinationName);
  console.log("destinationNameAndJwt: ", destinationNameAndJwt);

  const response = await executeHttpRequest(await getCFAPIdestination(), {
    method: "get",
    url: "/v3/organizations",
  });
  return response.data;
}

async function createRoute(appEnv, tenantHost, domain) {
  const cfAPIdestination = await getCFAPIdestination();
  // check if route exists
  const routes = (
    await executeHttpRequest(cfAPIdestination, {
      method: "get",
      url:
        `/v3/routes` +
        `?organization_guids=${appEnv.app.organization_id}` +
        `&space_guids=${appEnv.app.space_id}` +
        `&hosts=${tenantHost}`,
    })
  ).data.resources;
  if (routes.length === 0) {
    const uiappGuid = (
      await executeHttpRequest(cfAPIdestination, {
        method: "get",
        url:
          `/v3/apps` +
          `?organization_guids=${appEnv.app.organization_id}` +
          `&space_guids=${appEnv.app.space_id}` +
          `&names=mt-beershop-ui`,
      })
    ).data.resources[0].guid;
    console.log("UI App GUID: ", uiappGuid);
    const domainGuid = (
      await executeHttpRequest(cfAPIdestination, {
        method: "get",
        url: `/v3/domains?names=${domain}`,
      })
    ).data.resources[0].guid;
    console.log("Domain GUID: ", domainGuid);
    const routeGuid = (
      await executeHttpRequest(cfAPIdestination, {
        method: "post",
        url: "/v3/routes",
        data: {
          host: tenantHost,
          relationships: {
            space: {
              data: {
                guid: appEnv.app.space_id,
              },
            },
            domain: {
              data: {
                guid: domainGuid,
              },
            },
          },
        },
      })
    ).data.guid;
    console.log("Route GUID: ", routeGuid);
    const mapRouteToApp = await executeHttpRequest(cfAPIdestination, {
      method: "post",
      url: `/v3/routes/${routeGuid}/destinations`,
      data: {
        destinations: [
          {
            app: {
              guid: uiappGuid,
            },
          },
        ],
      },
    });
  }
}

module.exports = { getOrganizations, createRoute };

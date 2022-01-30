const cds = require("@sap/cds");
const { getOrganizations } = require("./cf-api");
const cfenv = require("cfenv");
const appEnv = cfenv.getAppEnv();

const xsenv = require("@sap/xsenv");
xsenv.loadEnv();
const services = xsenv.getServices({
  uaa: { tag: "xsuaa" },
  registry: { tag: "SaaS" },
  sm: { label: "service-manager" },
  dest: { tag: "destination" },
});

cds.on("bootstrap", async (app) => {
  await cds.mtx.in(app);

  const provisioning = await cds.connect.to("ProvisioningService");
  provisioning.prepend(() => {
    provisioning.on("UPDATE", "tenant", async (req, next) => {
      await next(); // default implementation creating HDI container
      let tenantHost =
        req.req.body.subscribedSubdomain +
        // Don't add space
        // "-" +
        // appEnv.app.space_name.toLowerCase().replace(/_/g, "-") +
        "-" +
        services.registry.appName.toLowerCase().replace(/_/g, "-");
      let domain = /\.(.*)/gm.exec(appEnv.app.application_uris[0])[1];
      let tenantURL = "https://" + tenantHost + "-ui." + domain;
      console.log("Created Tenant URL: ", tenantURL);
      // Read CF Organizations via Cloud SDK
      const cfOrgs = getOrganizations(req);
      console.log("Cloud Foundry Organizations", cfOrgs.resources);
      // Fails with:
      // Could not fetch client credentials token for service of type "destination"
      /*
      const cfapi = await cds.connect.to("cfapi");
      const uiappGuid = (
        await cfapi.get(
          `/v3/apps` +
            `?organization_guids=${appEnv.app.organization_id}` +
            `&space_guids=${appEnv.app.space_id}` +
            `&names=mt-beershop-ui`
        )
      ).resources[0].guid;
      const domainGuid = (await cfapi.get(`/v3/domains?names=${domain}`))
        .resources[0].guid;
      console.log("UI App GUID: ", uiappGuid);
      const createRoute = await cfapi.post("/v3/routes", {
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
      });
      const mapRouteToApp = await cfapi.post(
        `/v3/routes/${createRoute.guid}/destinations`,
        {
          destinations: [
            {
              app: {
                guid: uiappGuid,
              },
            },
          ],
        }
      );
      */
      return tenantURL;
    });
  });
});

// Delegate bootstrapping to built-in server.js
module.exports = cds.server;

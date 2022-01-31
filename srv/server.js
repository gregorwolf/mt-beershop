const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
const { getOrganizations, createRoute } = require("./cf-api");
const cfenv = require("cfenv");
const appEnv = cfenv.getAppEnv();

const port = process.env.PORT || 4004;

const xsenv = require("@sap/xsenv");
xsenv.loadEnv();
const services = xsenv.getServices({
  uaa: { tag: "xsuaa" },
  registry: { tag: "SaaS" },
  sm: { label: "service-manager" },
  dest: { tag: "destination" },
});

cds.on("mtx", async () => {
  console.log("on mtx reached");
  const provisioning = await cds.connect.to("ProvisioningService");
  provisioning.prepend(() => {
    console.log("prepend event handlers for ProvisioningService");
    provisioning.on("DELETE", "tenant", async (req) => {
      console.log("Custom tenant DELETE handler - path: ", req.path);
    });
    provisioning.on("UPDATE", "tenant", async (req, next) => {
      await next(); // default implementation creating HDI container
      let tenantHost =
        req.req.body.subscribedSubdomain +
        // Don't add space
        // "-" +
        // appEnv.app.space_name.toLowerCase().replace(/_/g, "-") +
        "-" +
        services.registry.appName.toLowerCase().replace(/_/g, "-") +
        "-ui";
      let domain = /\.(.*)/gm.exec(appEnv.app.application_uris[0])[1];
      let tenantURL = "https://" + tenantHost + "." + domain;
      console.log("Created Tenant URL: ", tenantURL);
      // Read CF Organizations via Cloud SDK
      try {
        console.log("Read CF Organizations via Cloud SDK");
        const cfOrgs = await getOrganizations(req);
        console.log("Cloud Foundry Organizations", cfOrgs.resources);
      } catch (error) {
        console.log(error.message);
      }
      // Fails with:
      // Could not fetch client credentials token for service of type "destination"
      if (process.env.CREATE_ROUTE && process.env.CREATE_ROUTE === "CAP") {
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
      } else {
        await createRoute(appEnv, tenantHost, domain);
      }
      return tenantURL;
    });
  });
});

cds.on("bootstrap", (app) => app.use(proxy()));

// Delegate bootstrapping to built-in server.js
module.exports = cds.server;

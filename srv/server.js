const cds = require("@sap/cds");
const LOG = cds.log("custom-mtx");
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
  conn: { tag: "connectivity" },
});

cds.env.mtx.dependencies = [services.dest.xsappname, services.conn.xsappname];
cds.env.odata.protectMetadata = false;

cds.on("mtx", async () => {
  LOG.info("on mtx reached");
  const provisioning = await cds.connect.to("ProvisioningService");
  const model = await cds.connect.to("ModelService");

  await model.prepend(() => {
    LOG.info("prepend event handlers for ModelService");

    model.on("asyncUpgrade", async (req, next) => {
      const { autoUndeploy, tenants } = cds.context.req.body;
      console.log(
        "UpgradeTenant: ",
        req.data.subscribedTenantId,
        req.data.subscribedSubdomain,
        instanceData,
        deploymentOptions
      );
      // TODO:
      // Implement upgrade logic that fills SERVICE_REPLACEMENTS env variable
      // like it is done in the tenant subscription handler
      await next();
    });
  });

  await provisioning.prepend(() => {
    LOG.info("prepend event handlers for ProvisioningService");

    provisioning.on("DELETE", "tenant", async (req, next) => {
      LOG.info("Custom tenant DELETE handler - path: ", req.path);
      await next(); // default implementation deleting HDI container
      LOG.info("Successfully deleted tenant");
    });

    provisioning.on("UPDATE", "tenant", async (req, next) => {
      const cfapi = await cds.connect.to("cfapi");
      const vcap = JSON.parse(process.env.VCAP_SERVICES);
      const upsName = req.data.subscribedSubdomain + "_CS1HDIAdb";
      // Check if UPS is existing in vcap
      let upsContent = vcap["user-provided"]?.filter((ups) => {
        ups.name === upsName;
      });
      if (upsContent === undefined || upsContent.length === 0) {
        // Use Cloud Foundry API to read details of UPS
        // Local Test with CF CLI:
        // cf curl "v3/service_instances?type=user-provided&names=anonymous_CS1HDIAdb"
        const upsGetResult = await cfapi.get(
          `/v3/service_instances?type=user-provided&names=${upsName}`
        );
        upsGuid = upsGetResult.resources[0].guid;
        upsCredentials = await cfapi.get(
          `/v3/service_instances/${upsGuid}/credentials`
        );
        upsContent = {
          label: "user-provided",
          name: upsName,
          tags: ["hana"],
          instance_guid: upsGuid,
          instance_name: upsName,
          binding_name: null,
          credentials: upsCredentials,
          syslog_drain_url: null,
          volume_mounts: [],
        };
        if (vcap["user-provided"] === undefined) {
          vcap["user-provided"] = [];
        }
        // add it to vcap
        vcap["user-provided"].push(upsContent);
        // set env variable VCAP_SERVICES
        process.env.VCAP_SERVICES = JSON.stringify(vcap);
      }
      process.env.SERVICE_REPLACEMENTS = JSON.stringify([
        {
          key: "ServiceName_1",
          name: "cross-container-service-1",
          service: upsName,
        },
      ]);
      LOG.debug("SERVICE_REPLACEMENTS", process.env.SERVICE_REPLACEMENTS);

      await next(); // default implementation creating HDI container
      if (req.req !== undefined) {
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
        LOG.info("Created Tenant URL: ", tenantURL);
        // Read CF Organizations via Cloud SDK
        try {
          LOG.info("Read CF Organizations via Cloud SDK");
          const cfOrgs = await getOrganizations(req);
          LOG.info("Cloud Foundry Organizations", cfOrgs.resources);
        } catch (error) {
          LOG.info(error.message);
        }
        // Fails with:
        // Could not fetch client credentials token for service of type "destination"
        if (process.env.CREATE_ROUTE && process.env.CREATE_ROUTE === "CAP") {
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
          LOG.info("UI App GUID: ", uiappGuid);
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
      }
    });
  });
});

cds.on("bootstrap", (app) => app.use(proxy()));

// Delegate bootstrapping to built-in server.js
module.exports = cds.server;

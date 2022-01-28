const cds = require("@sap/cds");
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
        "-" +
        appEnv.app.space_name.toLowerCase().replace(/_/g, "-") +
        "-" +
        services.registry.appName.toLowerCase().replace(/_/g, "-");
      let tenantURL =
        "https://" +
        tenantHost +
        /\.(.*)/gm.exec(appEnv.app.application_uris[0])[0];
      return tenantURL;
    });
  });
});

// Delegate bootstrapping to built-in server.js
module.exports = cds.server;

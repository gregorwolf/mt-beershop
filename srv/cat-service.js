module.exports = cds.service.impl(async function () {
  const bupa = await cds.connect.to("EPM_REF_APPS_PROD_MAN_SRV");

  this.on("READ", "Suppliers", (req) => {
    return bupa.run(req.query);
  });
});

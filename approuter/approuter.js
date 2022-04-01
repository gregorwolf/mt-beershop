var approuter = require("@sap/approuter");

var ar = approuter();
ar.start({
  extensions: [require("./extension.js")],
});

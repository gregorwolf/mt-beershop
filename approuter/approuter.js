var approuter = require("@sap/approuter");

var ar = approuter();
ar.start({
  extensions: [require("@gregorwolf/approuter-basicauth2jwt")],
});

const { retrieveJwt } = require("@sap-cloud-sdk/core");

function getDestinationNameAndJwt(req, destinationName) {
  const destination = {
    destinationName: destinationName,
  };
  const jwt = retrieveJwt(req);
  if (jwt && jwt !== "") {
    destination.jwt = jwt;
  }
  return destination;
}

module.exports = { getDestinationNameAndJwt };

module.exports = {
  insertMiddleware: {
    first: [
      function logRequest(req, res, next) {
        console.log("### DEBUG ### Got request %s %s", req.method, req.url);
        if (req.headers.authorization) {
          // Check if Basic Authorization is provided
          // Get JWT
          // Cache JWT
          // Set x-approuter-authorization header
          req.headers["x-approuter-authorization"] = req.headers["x-test"];
        }
        next();
      },
    ],
    beforeRequestHandler: [
      {
        path: "/extension",
        handler: function myMiddleware(req, res, next) {
          if (!req.headers.authorization) {
            res.setHeader(
              "WWW-Authenticate",
              'Basic realm="Approuter Basic Auth", charset="UTF-8"'
            );
            res.statusCode = 401;
            res.end("Unauthorized");
            console.log("### DEBUG ### No authorization header provided");
            return;
          }
          console.log(req.headers.authorization);
          res.end("### DEBUG ### Request handled by basic-auth extension");
        },
      },
    ],
  },
};

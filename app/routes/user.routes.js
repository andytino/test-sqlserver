const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isMod],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/adminormod",
    [authJwt.verifyToken, authJwt.isAdminOrMod],
    controller.userBoard
  );
};

const controller = require("../controllers/auth.controller.js");

module.exports = function (app) {
  //   app.use(function (req, res, next) {
  //     // res.header(
  //     //   "Access-Control-Allow-Headers",
  //     //   "x-access-token, Origin, Content-Type, Accept"
  //     // );
  //     res.header("Access-Control-Allow-Origin", "*");
  //     // res.header("Access-Control-Allow-Methods", "GET,POST");
  //     // res.header(
  //     //   "Access-Control-Allow-Headers",
  //     //   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  //     // );
  //     next();
  //   });

  app.post("/api/login", controller.signin);
};

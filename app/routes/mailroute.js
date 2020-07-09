const mailer = require("../controllers/mailControllers");

module.exports = function (app) {
  app.get("/chart", mailer.sendmail);
};

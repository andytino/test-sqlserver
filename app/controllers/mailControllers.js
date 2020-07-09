const fetch = require("node-fetch");
const mailer = require("../utils/mailer");
const url = "http://103.39.93.94:7777/getdata";

const sendMail = async (req, res, next) => {
  var alert = "";
  await fetch(url)
    .then((res) => res.json())
    .then((result) => {
      // console.log(result);
      alert = result.data[0] / (result.data[0] + result.data[1]);
      console.log(alert);
      return alert;
    });

  let expired = 0.45;
  // let expired2 = 0.9;
  // let expired2 = 0.9;

  try {
    if (alert === expired) {
      await mailer.sendMail();
      console.log("Your email has been sent successfully");
      // res.json("Your email has been sent successfully");
    } else {
      console.log("not expire");
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendmail: sendMail,
};

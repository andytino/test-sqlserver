const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail.config");

const sendMail = () => {
  const transporter = nodemailer.createTransport({
    host: mailConfig.mailHost,
    port: mailConfig.mailPort,
    secure: false,
    auth: {
      user: mailConfig.adminEmail,
      pass: mailConfig.adminPassword,
    },
  });

  const options = {
    from: mailConfig.adminEmail,
    to: "vietthang.tranthinh@gmail.com, phanvietthang94@gmail.com",
    subject: "hello",
    html: "<b>Hello world?</b>",
  };

  return transporter.sendMail(options);
};

module.exports = {
  sendMail: sendMail,
};

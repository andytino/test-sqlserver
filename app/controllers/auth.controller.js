const sql = require("mssql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const fs = require("fs");

const sqlConfig = require("../config/db.config");
const config = require("../config/auth.config");
// const { user } = require("../config/db.config");

exports.signin = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  // --- get login info
  var iptest = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  var ip = iptest.replace(/^.*:/, "");

  const writelog = username;

  var d = new Date();
  var day = d.getDay();
  var month = d.getMonth();
  var year = d.getFullYear();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var second = d.getSeconds();
  var time = `${hour}:${minute}:${second} - ${day}/${month}/${year}`;
  //---- get login info -- end

  bcrypt.hash(password, 10, (err, passClientEncode) => {
    try {
      if (username && passClientEncode) {
        sql.connect(sqlConfig, (err) => {
          if (err) {
            console.log(err);
          }
          var request = new sql.Request();
          // console.log(passClientEncode)
          request.query(
            `SELECT * FROM [user].[dbo].[UserLogin] WHERE UserName = '${username}'`,
            (err, data) => {
              if (err) {
                return console.log(err);
              }
              const user = data.recordset;
              // console.log(user[0].Roles)
              if (user.length === 0) {
                return res.status(200).json({ message: "Incorrect Username" });
              }
              if (user[0].UserName === username) {
                bcrypt.compare(user[0].Password, passClientEncode, function (
                  err,
                  result
                ) {
                  if (result === true) {
                    const payload = {
                      role: user[0].Role_ID,
                      // username : user[0].UserName
                    };
                    var token = jwt.sign(payload, config.secret, {
                      expiresIn: config.tokenLife,
                    });

                    // ---- write login info
                    fs.appendFile(
                      "./app/log/logfile.md",
                      `${ip} . ${time} . ${writelog.trim()}\n`,
                      (err) => {
                        if (err) {
                          throw err;
                        }
                        console.log("file save");
                      }
                    );
                    // ---- write login info -- end

                    return res.status(200).json({
                      message: "pass",
                      token: token,
                      role: "ROLE_" + user[0].Role_ID,
                      username: user[0].UserName,
                    });
                  } else if (result === false) {
                    return res
                      .status(200)
                      .json({ message: "Incorrect Password" });
                  }
                });
              }
            }
          );
        });
      } else {
        return res
          .status(200)
          .json({ message: "Please enter Username and/or Password" });
      }
    } catch (error) {
      res.status(500).json({ message: "error connecting to db", error });
    }
  });
};

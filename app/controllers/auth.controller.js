const sql = require("mssql");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const sqlConfig = require('../config/db.config')
const config = require('../config/auth.config')

exports.signin = (req, res) => {
  
    var username = req.body.username;
    var password = req.body.password;

    bcrypt.hash(password,10, (err,passClientEncode) => {
      try {
        if(username && passClientEncode) {
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
                    const user = data.recordset
                    // console.log(user[0].Roles)
                    if(user.length === 0) {
                      return res.status(200).json({message: 'Incorrect Username'})
                    }
                    if (user[0].UserName === username) {
                      bcrypt.compare(user[0].Password, passClientEncode, function(err, result) {
                        if(result === true){
                          const payload = {
                            role: user[0].Role_ID,
                            // username : user[0].UserName
                          };
                          var token = jwt.sign(payload, config.secret, {
                            expiresIn: config.tokenLife,
                          });
                          
                          return res.status(200).json({message: 'pass', token: token, role: "ROLE_" + user[0].Role_ID, username: user[0].UserName })
                        } else if (result === false) {
                          return res.status(200).json({message: 'Incorrect Password'})
                        } 
                      })
                    } 
                  }
                );
            });
        } else {
            return res.status(200).json({message: 'Please enter Username and/or Password'})
        }
    } catch (error) {
        res.status(500).json({message: "error connecting to db",error})
    }
  })
}


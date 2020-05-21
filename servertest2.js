const express = require("express");
const sql = require("mssql");
const cookieParser = require('cookie-parser')
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt= require('bcrypt')
const cors = require("cors");
const app = express();

const jwt = require('jsonwebtoken')
const config = require('./app/config/auth.config')
const sqlConfig = require('./app/config/db.config')

const port = process.env.PORT || 8080;


// parse application/json 
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// var corsOptions = {
//   origin: "http://localhost:8080"
// };
app.use(cors());


app.post("/userlogin",  (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    bcrypt.hash(password,10, async (err,passClientEncode) => {
      try {
        if(username && passClientEncode) {
            sql.connect(sqlConfig, (err) => {
                if (err) {
                  console.log(err);
                }
                var request = new sql.Request();
            
                request.query(
                  `SELECT * FROM [user].[dbo].[UserLogin] WHERE UserName = '${username}'`,
                  (err, data) => {
                    if (err) {
                      return console.log(err);
                    } 
                    const user = data.recordset
                    if(user.length === 0) {
                      return res.status(200).json({message: 'Incorrect Username or Password'})
                    }
                    if (user[0].UserName === username) {
                      bcrypt.compare(user[0].Password, passClientEncode, function(err, result) {
                        if(result === true){
                          const payload = {
                            username: "hihi",
                          };
                          var token = jwt.sign(payload, config.secret, {
                            expiresIn: config.tokenLife,
                          });
                          return res.status(200).json({message: 'pass', token: token})
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
});

const checkToken = (req,res,next) => {
  const header = req.header['authorization']
  if(typeof header !== 'undefined'){
    const bearer = header.split('' );
    const token = bearer[1]

    req.token = token
    next()
  } else {
    res.sendStatus(403).json({message: "header is undefined"})
  }
}

app.get("/chart", checkToken, (res, req) => {
  jwt.verify(req.token, config.secret, (err, authorizedData) => {
    if(err){
      console.log('Error: could not connect to the protected route');
      res.sendStatus(403).json({message: "error"})
    } else {
      res.json({
        message: 'successful log in',
        authorizedData
      })
      console.log('SUCCESS: Connected to protected route');
    }
  })
})


app.listen(port, () => {
  console.log(`server listening on port ${port}!`);
});

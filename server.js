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

const port = process.env.PORT || 8080;

const users = []
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

const sqlConfig = {
    user: 'admin',
    password: '123456',
    server: 'localhost\\MSSQLSERVER',
    database: 'user',
    port: 1433,
    options: {
      encrypt: true,
      enableArithAbort: true
    },
};

app.use(
  session({
    secret: "serect",
    resave: true,
    saveUninitialized: false,

  })
);

// parse application/json 
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.post("/userlogin", async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    bcrypt.hash(password,10,function(err,passClientEncode){
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
                          return res.status(200).json({message: 'pass'})
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

app.listen(port, () => {
  console.log(`server listening on port ${port}!`);
});

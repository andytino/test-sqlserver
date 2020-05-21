const sql = require("mssql");
const jwt = require("jsonwebtoken")
const config = require("../config/auth.config")

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    //Verify user
    jwt.verify(token, config.secret, (err, decode) => {
        console.log(token)
        console.log(config.secret)
        if(err){
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        // req.userId = decode.id;
        next()
    })
}

isAdmin = (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    try {
        if(username && password) {
            sql.connect(slqConfig, (err) => {
                if(err) {
                    console.log(err)
                }
                var request = new sql.Request()
                request.query(
                    `SELECT * FROM [user].[dbo].[UserLogin] WHERE UserName = '${username}'`,
                    (err, data) => {
                        const user = data.recordset
                        if(user[0].Roles === "admin"){
                            next()
                            return res.json({mess: "admin"})
                        } else {
                            return res.json({mess: "Require Admin Role!"})
                        }
                    }  
                )
            })
        }
    } catch (err) {
        res.status(500).json({mess: "error connecting to db",error})
    }
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
}

module.exports = authJwt
const sql = require("mssql");
const jwt = require("jsonwebtoken")
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const sqlConfig = require("../config/db.config")
const config = require("../config/auth.config")

// parse application/json 
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));


verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    //Verify user
    jwt.verify(token, config.secret, (err, decode) => {
        // console.log(token)
        // console.log(config.secret)
        if(err){
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        // console.log(decode.role)
        req.role = decode.role;
        req.username = decode.username
        next()
    })
}


isAdmin = (req, res, next) => {
    if(req.role === 1) {
        next();
        return;
    } 
    
    res.status(403).send({mess: "Require Admin Role!"})
    
}

isMod = (req, res, next) => {
    if(req.role === 2) {
        next();
        return;
    } 
    
    res.status(403).send({mess: "Require Moderator Role!"})
    
}

isAdminOrMod = (req, res, next) => {
    if(req.role === 1) {
        next();
        return;
    } 
    if(req.role === 2) {
        next();
        return;
    } 
    
    res.status(403).send({mess: "Require Admin or Moderator Role!"})
    
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isMod: isMod,
    isAdminOrMod: isAdminOrMod
}

module.exports = authJwt
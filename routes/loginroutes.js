const sql = require('mssql')

exports.login = async function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    sql.connect('SELECT * FROM user WHERE username = ?', [username], async function (error,results, fields){
        if(error){
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            if(results.length > 0) {
                if(password){
                    res.send({
                        "code":200,
                        "success":"login sucessful"
                    })
                } else {
                    res.send({
                        "code": 204,
                        "success":"email and password does not macth"
                    })
                }
            } else {
                res.send({
                    "code": 206,
                    "success": "email does not exits"
                })
            }
        }
    })
}
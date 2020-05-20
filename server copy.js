const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express();

var loginroutes = require('./routes/loginroutes');

const port = 8081

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Allow cross origin requests
app.use(cors())

var router = express.Router();
router.post('/login',loginroutes.login);

app.get("/user", function(req, res){
    const sql = require('mssql')

    var sqlConfig = {
        user: 'admin',
        password: '123456',
        server: 'localhost\\MSSQLSERVER',
        database: 'user',
        port: 1433
    }

    sql.connect(sqlConfig, function(err){
        if (err) console.log(err);

        var request = new sql.Request();

        request.query('SELECT [username],[password] FROM [user].[dbo].[user]', function(err, recordset){
            if(err) {
                console.log(err)
            }
            
            res.end(JSON.stringify(recordset));
        })
    })
})

app.listen(port, () => {
    console.log(`express server listening on port ${port}!`)
})


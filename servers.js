const sql = require("msnodesqlv8");
 
const connectionString = "server=DESKTOP-M59C3T1\\MYSQL2019;Database=test2;Trusted_Connection=No;Uid=sa;Pwd=123456;Driver={SQL Server Native Client 11.0}";
const query = "SELECT name FROM sys.databases";
 
sql.query(connectionString, query, (err, rows) => {
    if(err) throw err
    console.log(rows);
});
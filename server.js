const sql = require("mssql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 8080;



// parse application/json 
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

// var corsOptions = {
//   origin: "http://localhost:8080"
// };
app.use(cors());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

require('./app/routes/auth.routes.js')(app)
require('./app/routes/user.routes')(app)

app.listen(port, () => {
  console.log(`server listening on port ${port}!`);
});

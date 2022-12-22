const express = require("express");
const mysql = require("mysql2");
const faker = require("faker");

// Create connection
const db = mysql.createConnection({
    host: "localhost",  
    user: "root",  
    password: "Ganesh20022002"
  });

// Connect to MySQL
db.connect((err) => {  
    if (err) {  
      throw err;  
    }  
    console.log("MySql Connected");
  });

const app = express();
app.set("view-engine", "ejs");

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    let sql =  
    "select distinct firstname, lastname " +
    "from " +
    "autorepair.customer C " +
    "LEFT JOIN " +
    "autorepair.service_records SR " + 
    "on C.id = SR.customer_id " +
    "LEFT JOIN  " +
    "autorepair.employee E " +
    "on E.id = SR.employee_id  LIMIT 15";

    db.query(sql, (err, rows) => {
      if(err) throw err;  
      res.render('index.ejs', {'customers': rows});
    });      
});

app.get('/records', function(req, res, next) {
    var lastName = req.query.lastName
    var firstName = req.query.firstName

    var params = [firstName.toUpperCase(), lastName.toUpperCase()];
    let sql =  
      "select * " +
      "from " +
      "autorepair.customer C " +
      "LEFT JOIN " +
      "autorepair.service_records SR " +
      "on C.id = SR.customer_id " +
      "LEFT JOIN " +
      "autorepair.employee E " +
      "on E.id = SR.employee_id WHERE upper(firstname) = ? and upper(lastname) = ?";

    db.query(sql, params, (err, rows) => {
        if(err) throw err;  
        res.render('servicerecords.ejs', { servicerecords: rows});
    });  
});

app.listen("8080", () => {
    console.log("Server started on port 8080");
});

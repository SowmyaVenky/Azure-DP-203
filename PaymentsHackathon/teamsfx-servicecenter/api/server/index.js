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
const cors = require('cors');
app.use(cors({
  origin: '*'
}));

app.get('/summary', function(req, res) {
    var username = req.query.username;
    var params = [username];
    //console.log("Current user passed is: " + username);
    
    let sql =  
    "select count(distinct customer_id) as custcount, count(*) as service_recs, sum(vehicle_repair_cost) as repaircost " +
    "from " +
    "autorepair.customer C " +
    "LEFT JOIN " +
    "autorepair.service_records SR " + 
    "on C.id = SR.customer_id " +
    "LEFT JOIN  " +
    "autorepair.employee E " +
    "on E.id = SR.employee_id where E.name = ? group by E.name having E.name is not null";

    db.query(sql, params, (err, rows) => {
      if(err) throw err;  
      res.send(rows);
    });      
});

app.get('/monthlysummary', function(req, res) {
  var username = req.query.username;
  var params = [username];
  
  let sql =  
  "select " +
  " extract(year from vehicle_repair_date) as year, " + 
  " extract(month from vehicle_repair_date) as month, " +
  " count(distinct customer_id) as custcount," +
  " count(*) as service_recs, " +
  " sum(vehicle_repair_cost) as repaircost " +
  "from " +
  "autorepair.customer C " +
  "LEFT JOIN " +
  "autorepair.service_records SR " + 
  "on C.id = SR.customer_id " +
  "LEFT JOIN  " +
  "autorepair.employee E " +
  "on E.id = SR.employee_id where E.name = ? group by year, month order by year, month";
  
  db.query(sql, params, (err, rows) => {
    if(err) throw err;
    res.send(rows);
    });     
});


app.listen("8080", () => {
  console.log("Server started on port 8080");
});
const express = require("express");
const mysql = require("mysql2");
const faker = require("faker");
const bodyParser = require('body-parser');

// Create connection
const db = mysql.createConnection({
    //host: "localhost",  
    //user: "root",  
    host: "autorepairdb1001.mysql.database.azure.com",  
    user: "autoadmin",  
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

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

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

app.get('/mycustomers', function(req, res) {
  var username = req.query.username;
  var params = [username];
  
  let sql =  
  "select distinct " +
  " firstname, " + 
  " lastname, " +
  " address," +
  " address2, " +
  " city, " +
  " state, " +
  " zip, " +
  " phone, " +
  " email, " + 
  " creditcard " +
  "from " +
  "autorepair.customer C " +
  "LEFT JOIN " +
  "autorepair.service_records SR " + 
  "on C.id = SR.customer_id " +
  "LEFT JOIN  " +
  "autorepair.employee E " +
  "on E.id = SR.employee_id where E.name = ? ";
  
  db.query(sql, params, (err, rows) => {
    if(err) throw err;
    res.send(rows);
    });     
});

app.post('/inspectionsubmit', function(req, res) {
  console.log(req.body);
  res.send({'message': 'Inspection report accepted!'});
});

app.get('/vehiclebyvin', function(req, res) {
  var vin = req.query.vin;
  var params = [vin];

  let sql =  
  "select " + 
  "vehicle_color, " +
  "vehicle_fuel, " +
  "vehicle_manufacturer, " +
  "vehicle_model, " +
  "vehicle_type, " +
  "vehicle_vrm, " +
  "vehicle_problem, " +
  "vehicle_repair_cost, " +
  "vehicle_repair_date, " +
  "vehicle_repair_status, " +
  "vehicle_vin " +
  "from " +
  "autorepair.customer C " +
  "LEFT JOIN " +
  "autorepair.service_records SR " + 
  "on C.id = SR.customer_id " +
  "LEFT JOIN  " +
  "autorepair.employee E " +
  "on E.id = SR.employee_id where vehicle_vin = ?";

  db.query(sql, params, (err, rows) => {
    if(err) throw err;  
    res.send(rows);
  });      
});

app.get('/vehiclebyvrm', function(req, res) {
  var vrm = req.query.vrm;
  var params = [vrm];

  let sql =  
  "select " + 
  "vehicle_color, " +
  "vehicle_fuel, " +
  "vehicle_manufacturer, " +
  "vehicle_model, " +
  "vehicle_type, " +
  "vehicle_vrm, " +
  "vehicle_problem, " +
  "vehicle_repair_cost, " +
  "vehicle_repair_date, " +
  "vehicle_repair_status, " +
  "vehicle_vin " +
  "from " +
  "autorepair.customer C " +
  "LEFT JOIN " +
  "autorepair.service_records SR " + 
  "on C.id = SR.customer_id " +
  "LEFT JOIN  " +
  "autorepair.employee E " +
  "on E.id = SR.employee_id where vehicle_vrm = ?";

  db.query(sql, params, (err, rows) => {
    if(err) throw err;  
    res.send(rows);
  });      
});

app.get('/vehiclebyemail', function(req, res) {
  var email = req.query.email;
  var params = [email];

  let sql =  
  "select " + 
  "vehicle_color, " +
  "vehicle_fuel, " +
  "vehicle_manufacturer, " +
  "vehicle_model, " +
  "vehicle_type, " +
  "vehicle_vrm, " +
  "vehicle_problem, " +
  "vehicle_repair_cost, " +
  "vehicle_repair_date, " +
  "vehicle_repair_status, " +
  "vehicle_vin " +
  "from " +
  "autorepair.customer C " +
  "LEFT JOIN " +
  "autorepair.service_records SR " + 
  "on C.id = SR.customer_id " +
  "LEFT JOIN  " +
  "autorepair.employee E " +
  "on E.id = SR.employee_id where email = ?";

  db.query(sql, params, (err, rows) => {
    if(err) throw err;  
    res.send(rows);
  });      
});

app.listen("8080", () => {
  console.log("Server started on port 8080");
});
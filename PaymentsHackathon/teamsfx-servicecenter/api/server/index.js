const express = require("express");
const mysql = require("mysql2");
const faker = require("faker");
const bodyParser = require('body-parser');

// Create connection
const db = mysql.createConnection({
    // host: "localhost",  
    // user: "root",  
    // host: "autorepairdb1001.mysql.database.azure.com",  
    // user: "autoadmin",
    host: ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "localhost" : "autorepairdb1001.mysql.database.azure.com"),
    user: ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "root" : "autoadmin"),
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
const { response } = require("express");
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
    console.log("Current user passed is: " + username);
    
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
  "select " +
  " SR.id, " +
  " SR.vehicle_vin, " +
  " firstname, " + 
  " lastname, " +
  " phone, " +
  " email, " + 
  " SR.vehicle_repair_status " +
  "from " +
  "autorepair.service_records SR " +
  "LEFT JOIN " +
  "autorepair.customer C " + 
  "on C.id = SR.customer_id " +
  "LEFT JOIN  " +
  "autorepair.employee E " +
  "on E.id = SR.employee_id where E.name = ? " +
  "ORDER BY SR.id desc limit 30 ";
  
  db.query(sql, params, (err, rows) => {
    if(err) throw err;
    res.send(rows);
    });     
});

async function getEmployee(empName){
  console.log("starting getCust with " + empName);
  var params = [empName.trim().toUpperCase()];
  
  let empsql =  
  "select id from " +
  "autorepair.employee where " +
  "upper(name) = ?";
  return new Promise((resolve) => {
    console.log("call getEmp query with " + JSON.stringify(params));
    console.log("empsql " + empsql);
    db.query(empsql, params, (err, rows) => {
      if(err) throw err;      
      console.log("emp query callback found " + JSON.stringify(rows));
      resolve(rows[0].id);
      // custrows = rows;
    });
    // custrows = rows;
  })  

}


async function getCusotmer(customerName){
  console.log("starting getCust with " + customerName);
  var params = [customerName.trim().toUpperCase()];
  
  let custsql =  
  "select id from " +
  "autorepair.customer C where " +
  "upper(lastname) = ?";
  return new Promise((resolve) => {
    console.log("call getCust query with " + JSON.stringify(params));
    console.log("custsql " + custsql);
    db.query(custsql, params, (err, rows) => {
      if(err) throw err;      
      console.log("customer query callback found " + JSON.stringify(rows));
      resolve(rows[0].id);
      // custrows = rows;
    });
    // custrows = rows;
  })  
  
}

app.post('/inspectionsubmit', async (req, res) => {

  // console.log(JSON.stringify(req));
  
  let serviceRecord = req.body;
  console.log(JSON.stringify(serviceRecord.lastName));
  // var params = [serviceRecord.lastName];

  console.log("Let's save an inspections with " + JSON.stringify(serviceRecord))

  // let custsql =  
  // "select id from " +
  // "autorepair.customer C where " +
  // "upper(lastname) = ?";

  // let custrows;
  // db.query(custsql, params, (err, rows) => {
  //   if(err) throw err;
  //   console.log("rows " + JSON.stringify(rows));
  //   custrows = rows;
  //   });

  let empId = await getEmployee(serviceRecord.userName);

  getCusotmer(serviceRecord.lastName).then((customer) => {    
      
    console.log("cust " + JSON.stringify(customer));

    // let customer = custrows[0];

    var vehicle_color = faker.vehicle.color();
    var vehicle_fuel = faker.vehicle.fuel();
    var vehicle_manufacturer = faker.vehicle.manufacturer();
    var vehicle_model = faker.vehicle.model();
    var vehicle_type = faker.vehicle.type();
    var vehicle_vrm = faker.vehicle.vrm();

    var formattedDate = new Date(serviceRecord.inspectionDate);

    console.log("formatted date " + formattedDate);

    post = { 
      "employee_id": empId, 
      "customer_id": customer,
      "vehicle_color": vehicle_color,
      "vehicle_fuel": vehicle_fuel,
      "vehicle_manufacturer": vehicle_manufacturer,
      "vehicle_model": vehicle_model,
      "vehicle_type": vehicle_type,
      "vehicle_vin": serviceRecord.vin,
      "vehicle_vrm": vehicle_vrm,
      "vehicle_problem": "repair needed",
      "vehicle_repair_cost": faker.commerce.price(100, 900),
      "vehicle_repair_date": formattedDate,
      "vehicle_repair_status": "Pending review"
    };

    let sql = "INSERT INTO autorepair.service_records SET ?";

    query = db.query(sql, post, (err) => {
        if (err) {
            throw err;
        }
        res.send({'message': 'Inspection report accepted!'});
    });  
  });
  
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

app.get('/diagnostics-results', function(request, response, next) {
	var email = request.query.email;
  //teams does not keep sessions for some reason.
  // If the user is loggedin
  // if(email) {
    console.log("email is not null and moving to diagnostics results via email not session");
    response.render('diagnostics-results.ejs', { useremail: email});
  // }else if (request.session.loggedin) {
	// 	response.render('diagnostics-results.ejs', { useremail: request.session.email});
	// } else {
  //   response.redirect('/?loginerror=true');
	// }
	response.end();  
});

app.listen("8080", () => {
  console.log("Server started on port 8080");
});
const express = require("express");
const mysql = require("mysql2");
const faker = require("faker");
const session = require('express-session');

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
app.locals.moment = require('moment');

app.use(express.static(__dirname + '/static'));
app.use(session({
	secret: 'secret',
  name: 'deloreansauto',
	resave: true,
	saveUninitialized: true
}));
app.set('trust proxy', 1);

app.get('/', function(req, res) {
    var loginerror = req.query.loginerror;
    let sql =  
    "select distinct firstname, lastname, email " +
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
      res.render('index.ejs', {'loginerror': loginerror, 'customers': rows});
    });      
});

app.get('/records', function(req, res, next) {
    var email = req.query.email
    var password = req.query.password

    var params = [email.trim().toUpperCase(), password.trim().toUpperCase()];
    let sql =  
      "select * " +
      "from " +
      "autorepair.customer C " +
      "LEFT JOIN " +
      "autorepair.service_records SR " +
      "on C.id = SR.customer_id " +
      "LEFT JOIN " +
      "autorepair.employee E " +
      "on E.id = SR.employee_id WHERE upper(email) = ? and upper(lastname) = ? ORDER BY SR.vehicle_repair_date desc";

    var customerFirstName = "";
    var customerLastName = "";
    var customerPhone = "";
    var customerCreditCard = "";
    var customerEmail = email;
    var customerTitle = "";
    var address = "";
    var address2 = "";
    var city = "";
    var state = "";
    var zip = "";
    var vehicleVin = new Set();
    
    db.query(sql, params, (err, rows) => {
        var numRows = rows.length;        
        if(err) throw err;  
        if( numRows == 0 ) {
          res.redirect('/?loginerror=true');
        }else {
          req.session.loggedin = true;
				  req.session.email = email;
          rows.forEach(function(servicerecord) {
            customerFirstName = servicerecord.firstname;
            customerLastName = servicerecord.lastname;
            customerPhone = servicerecord.phone;
            customerCreditCard = servicerecord.creditcard;
            customerTitle = servicerecord.title;
            address = servicerecord.address;
            address2 = servicerecord.address2;
            city = servicerecord.city;
            state = servicerecord.state;
            zip = servicerecord.zip;
            vehicleVin.add(servicerecord.vehicle_vin);
          });

          //console.log(customerFirstName);
          //console.log(customerLastName);
          //console.log(vehicleVin);

          res.render('servicerecords.ejs', { 
            "customerFirstName": customerFirstName,
            "customerLastName": customerLastName,
            "customerPhone": customerPhone,
            "customerCreditCard": customerCreditCard,
            "vehicles": vehicleVin,
            "customerEmail": customerEmail, 
            "customerTitle": customerTitle,
            "address": address,
            "address2": address2,
            "city": city,
            "state": state,
            "zip": zip,
            servicerecords: rows});
        }        
    });  
});

app.get('/diagnostics', function(request, response, next) {
  var email = request.query.email;
  //teams does not keep sessions for some reason.
  // If the user is loggedin
  if(email) {
    console.log("email is not null and moving to diagnostics via email not session");
    response.render('diagnostics.ejs', { useremail: email});
  }	else if (request.session.loggedin) {
    console.log("email is null and moving to diagnostics via session");
		response.render('diagnostics.ejs', { useremail: request.session.email});
	} else {
		// Not logged in
    response.redirect('/?loginerror=true');
	}
	response.end();  
});

app.get('/diagnostics-results', function(request, response, next) {
	var email = request.query.email;
  //teams does not keep sessions for some reason.
  // If the user is loggedin
  if(email) {
    console.log("email is not null and moving to diagnostics results via email not session");
    response.render('diagnostics-results.ejs', { useremail: email});
  }else if (request.session.loggedin) {
		response.render('diagnostics-results.ejs', { useremail: request.session.email});
	} else {
		// Not logged in
    response.redirect('/?loginerror=true');
	}
	response.end();  
});

app.get('/payment', function(request, response, next) {
  var email = request.query.email;
  var creditcard = request.query.cc;
  var amount = request.query.amount;
  var message = "This will process payment of $" + amount + ", with cc = " + creditcard + " and send invoice to customer email = " + email;
  response.render('payments.ejs', { "message" : message });
  response.send();
});

app.listen("8080", () => {
    console.log("Server started on port 8080");
});

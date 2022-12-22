const express = require("express");
const mysql = require("mysql2");
const generator = require('creditcard-generator')
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

app.get("/createdb", (req, res) => {
    let sql = "CREATE DATABASE autorepair";  
    db.query(sql, (err) => {  
      if (err) {  
        throw err;  
      }  
      res.send("Database created");
    });  
  });

  app.get("/createemployeetable", (req, res) => {
    let sql =  
      "CREATE TABLE autorepair.employee(id int AUTO_INCREMENT, name VARCHAR(255), designation VARCHAR(255), PRIMARY KEY(id))";
  
    db.query(sql, (err) => {
      if (err) {  
        throw err;  
      }
  
      res.send("Employee table created");
    });  
  });

  app.get("/createemployees", (req, res) => {
    let post = { name: "Jake Smith", designation: "Service Advisor" };
    let sql = "INSERT INTO autorepair.employee SET ?";
    let query = db.query(sql, post, (err) => {
        if (err) {
            throw err;
        }
    });  

    post = { name: "Jim Barton", designation: "Service Advisor" };
    query = db.query(sql, post, (err) => {
        if (err) {
            throw err;
        }
    });  

    post = { name: "Greg Abbot", designation: "Service Advisor" };
    query = db.query(sql, post, (err) => {
        if (err) {
            throw err;
        }
    });  

    post = { name: "Michelle Smith", designation: "Service Advisor" };
    query = db.query(sql, post, (err) => {
        if (err) {
            throw err;
        }
    });  

    post = { name: "Mary Adams", designation: "Service Advisor" };
    query = db.query(sql, post, (err) => {
        if (err) {
            throw err;
        }
    });  

    res.send("Employees added");
  });

  app.get("/listemployees", (req, res) => {
    let sql =  
      "SELECT * FROM autorepair.employee";
      db.query(sql, (err, rows) => {
        if(err) throw err;  
        console.log(rows);   
        res.send(rows);
      });  
  });

  app.get("/deleteemployees", (req, res) => {
    let sql =  
      "DELETE FROM autorepair.employee";
      db.query(sql, (err) => {
        if(err) throw err;  
        res.send("Employee table cleared!");
      });  
  });

  app.get("/createcustomertable", (req, res) => {
    let sql =  
      "CREATE TABLE autorepair.customer(id int AUTO_INCREMENT, " 
       + " firstname VARCHAR(255), "
       + " lastname VARCHAR(255), "
       + " title VARCHAR(100), "
       + " phone VARCHAR(30), "
       + " address VARCHAR(255), "
       + " address2 VARCHAR(255), "
       + " city VARCHAR(100), "
       + " state VARCHAR(50), "
       + " zip VARCHAR(10), "
       + " email VARCHAR(100), "
       + " creditcard VARCHAR(30), "
       + " PRIMARY KEY(id))";
  
    db.query(sql, (err) => {
      if (err) {  
        throw err;  
      }
  
      res.send("Customer table created");
    });  
  });
 
  app.get("/createfakecustomers", (req, res) => {
    let sql = "INSERT INTO autorepair.customer SET ?";
    for (i = 0; i < 20; i++) {
        var firstName = faker.name.firstName();
        var lastName = faker.name.lastName();
        var title = faker.name.title();
        var phone = faker.phone.phoneNumber();
        var address = faker.address.streetAddress();
        var address2 = faker.address.secondaryAddress();
        var city = faker.address.city();
        var state = faker.address.state();
        var zip = faker.address.zipCode();
        var email = faker.internet.email(); 
        var creditCard = generator.GenCC();
        post = { 
            "firstName": firstName, 
            "lastName": lastName,
            "title": title,
            "phone": phone,
            "address": address,
            "address2": address2,
            "city": city,
            "state": state,
            "zip": zip,
            "email": email,
            "creditCard": creditCard 
            };
        query = db.query(sql, post, (err) => {
            if (err) {
                throw err;
            }
        });  
    }
     res.send("Fake customers are created!"); 
  });

  app.get("/listcustomers/:page", (req, res) => {
    let sql =  
      "SELECT * FROM autorepair.customer LIMIT " + req.params.page  + ", 10";
      db.query(sql, (err, rows) => {
        if(err) throw err;  
        console.log(rows);   
        res.send(rows);
      });  
  });

  app.get("/searchcustomers", (req, res) => {
    var lastName = req.query.lastName
    var firstName = req.query.firstName

    var params = [firstName.toUpperCase(), lastName.toUpperCase()];
    let sql =  
      "SELECT * FROM autorepair.customer WHERE upper(firstname) = ? and upper(lastname) = ?";
      db.query(sql, params, (err, rows) => {
        if(err) throw err;  
        res.send(rows);
      });  
  });

  var car_problems_list = [
    "Engine And Engine Cooling",	
    "Electrical System",	
    "Power Train",	
    "Air Bag",	
    "Service Brakes",	
    "Steering",	
    "Equipment",	
    "Structure",	
    "Suspension",	
    "Vehicle Speed Control",	
    "Other Fuel System",	
    "Visibility",	
    "Exterior Lighting",	
    "Gasoline Fuel System",	
    "Tire",	
    "Electronic Stability Control",	
    "Seat Belt",	
    "Seats",	
    "Wheel",	
    "Latches/locks/linkage",	
    "Parking Brake",	
    "Air Brake",	
    "Forward Collision Avoidance",	
    "Traction Control System",	
    "Diesel Fuel System",	
    "Interior Lighting",
    "Child Seat",	
    "Lane Departure",	
    "Back Over Prevention",	
    "Hybrid Propulsion System",	
    "Communication",	
    "Fire related",	
    "Chest Clip, Buckle, Harness",	
    "Equipment Adaptive/mobility",	
    "Carry Handle, Shell, Base" ];

var vehicle_repair_statuses = [
    "Identified",
    "Shared with customer",
    "Approved by customer",
    "Declined by customer",
    "Completed",
    "Paid"
];

var employee_id_min = 6;
var employee_id_max = 10;

var customer_id_min = 1;
var customer_id_max = 100;

app.get("/createservicerecordstable", (req, res) => {
    let sql =  
        "CREATE TABLE autorepair.service_records(id int AUTO_INCREMENT, " 
        + " employee_id int not null, "
        + " customer_id int not null, "
        + " vehicle_color VARCHAR(50), "
        + " vehicle_fuel VARCHAR(30), "
        + " vehicle_manufacturer VARCHAR(255), "
        + " vehicle_model VARCHAR(100), "
        + " vehicle_type VARCHAR(100), "
        + " vehicle_vin VARCHAR(50), "
        + " vehicle_vrm VARCHAR(10), "
        + " vehicle_problem VARCHAR(100), "
        + " vehicle_repair_cost DECIMAL(5,2), "
        + " vehicle_repair_date DATE, "
        + " vehicle_repair_status VARCHAR(100), "
        + " PRIMARY KEY(id))";
    
    db.query(sql, (err) => {
        if (err) {  
        throw err;  
        }
    
        res.send("Service Records table created");
    });  
    });
    
app.get("/createservicerecords", (req, res) => {     
    let sql = "INSERT INTO autorepair.service_records SET ?";
    for (i = 0; i < 200; i++) {
        var random_customer_id =  Math.floor(Math.random() * (customer_id_max - customer_id_min) + customer_id_min);
        var random_employee_id =  Math.floor(Math.random() * (employee_id_max - employee_id_min) + employee_id_min);
        var random_problem_index =  Math.floor(Math.random() * (car_problems_list.length));
        var random_status_index =  Math.floor(Math.random() * (vehicle_repair_statuses.length));

        var vehicle_color = faker.vehicle.color();
        var vehicle_fuel = faker.vehicle.fuel();
        var vehicle_manufacturer = faker.vehicle.manufacturer();
        var vehicle_model = faker.vehicle.model();
        var vehicle_type = faker.vehicle.type();
        var vehicle_vin = faker.vehicle.vin();
        var vehicle_vrm = faker.vehicle.vrm();
        var vehicle_problem = car_problems_list[random_problem_index];
        var vehicle_repair_cost = faker.commerce.price(100, 200);
        var vehicle_repair_date = faker.date.between("2022-01-01T00:00:00.000Z", "2024-01-01T00:00:00.000Z");        
        var vehicle_repair_status = vehicle_repair_statuses[random_status_index];

        post = { 
            "employee_id": random_employee_id, 
            "customer_id": random_customer_id,
            "vehicle_color": vehicle_color,
            "vehicle_fuel": vehicle_fuel,
            "vehicle_manufacturer": vehicle_manufacturer,
            "vehicle_model": vehicle_model,
            "vehicle_type": vehicle_type,
            "vehicle_vin": vehicle_vin,
            "vehicle_vrm": vehicle_vrm,
            "vehicle_problem": vehicle_problem,
            "vehicle_repair_cost": vehicle_repair_cost,
            "vehicle_repair_date": vehicle_repair_date,
            "vehicle_repair_status": vehicle_repair_status
        };

        query = db.query(sql, post, (err) => {
            if (err) {
                throw err;
            }
        });  
    }
        res.send("Fake service records are created!"); 
    });

app.get("/searchservicerecords", (req, res) => {
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
            res.send(rows);
          });  
});

  app.listen("3000", () => {
    console.log("Server started on port 3000");
  });
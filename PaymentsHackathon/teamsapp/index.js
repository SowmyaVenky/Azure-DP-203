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

  app.listen("3000", () => {
    console.log("Server started on port 3000");
  });
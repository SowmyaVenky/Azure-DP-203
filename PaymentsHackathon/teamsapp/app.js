const express = require("express");
const mysql = require("mysql2");
const faker = require("faker");
const session = require('express-session');
const path = require('path');
const app = express();
const cors = require('cors');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
const PORT = process.env.PORT || 3978;

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const {
  CloudAdapter,
  ConversationState,
  MemoryStorage,
  UserState,
  ConfigurationBotFrameworkAuthentication
} = require('botbuilder');

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

// Import our custom bot class that provides a turn handling function.
const { DialogBot } = require('./bots/dialogBot');
const { UserProfileDialog } = require('./dialogs/userProfileDialog');

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);

// Create the adapter. See https://aka.ms/about-bot-adapter to learn more about using information from
// the .bot file when configuring your adapter.
const adapter = new CloudAdapter(botFrameworkAuthentication);

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights. See https://aka.ms/bottelemetry for telemetry
    //       configuration instructions.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
    // Clear out state
    await conversationState.delete(context);
};

// Define the state store for your bot.
// See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.
const memoryStorage = new MemoryStorage();

// Create conversation state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Create the main dialog.
const dialog = new UserProfileDialog(userState);
const bot = new DialogBot(conversationState, userState, dialog);

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

// Listen for incoming requests.
app.post('/api/messages', async (req, res) => {
  // Route received a request to adapter for processing
  await adapter.process(req, res, (context) => bot.run(context));
});

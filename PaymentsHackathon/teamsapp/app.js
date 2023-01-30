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
const webhookURL = 'https://6g2rrf.webhook.office.com/webhookb2/18556687-90ae-4e12-93ad-f033a4f45a9d@de8bd1e0-78f7-4cd0-aeff-73e09d462d5c/IncomingWebhook/cf5e120fd89348a897c09588947fc9b2/579c7f37-c7d1-4869-89a8-906ad6f02c02';
const unirest = require('unirest');
const crypto = require('crypto');
const setTimeOut = require('timers/promises');

//For RTP
var api_key = process.env.KEY;
var api_secret = process.env.SECRET;
var br_token  = btoa(api_key + ':' + api_secret);

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
  //host: "autorepairdb1001.mysql.database.azure.com",  
  //user: "autoadmin",  
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

    var customerId = "";  
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
            customerId = servicerecord.customer_id;
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
            "customerId": customerId,
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

app.get('/api/rtpfundtransfer', async function(req, res, next) {
  try{ 
    console.log("api/rtpfundtransfer");
    var customerId = req.query.customerId;
    var invid = req.query.invId;
    var acctno = req.query.acctNo;
    var routno = req.query.routNo;
    var amount = req.query.amount;
    console.log(customerId, invid, acctno, routno);
    const bankRTPRes = await rtpFundTransfer(customerId, invid, acctno, routno, amount);
    //const bankRTPRes = await rtpFundTransfer("101138", "12344232122", "122105155");
    //res.send(bankRTPRes);
    res.render('payment-ack.ejs', { "status": bankRTPRes.status, "transactionId": bankRTPRes.transactionID, "message": "Below is the status of the transfer you have made."});
  }
  catch (error){
    console.log(`Error in /api/rtpfundtransfer handling: ${error}`);
    //res.status(500).json({status: 500, statusText: error });
    res.render('payment-ack.ejs', { "status": "ERROR", "transactionId": error, "message":"An error occured while transferring the amount, please try again later or call the customer center."});
  }

});

async function rtpFundTransfer(customerId, invid, acctno, routno, amount){
  function getToken(){
      return new Promise((resolve, reject) => {
          unirest('POST', 'https://sandbox.usbank.com/auth/oauth2/v1/token')
              .headers({
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic '+ br_token
              })
              .send('grant_type=client_credentials')
              .end(function (response) { 
                  if (response.error){
                      return reject(response.error);
                  }
                  else {
                      return resolve(response.body.accessToken);
                  }
              });
      })
  }

  function fundtransfer (accessToken,correlationId){
      return new Promise((resolve, reject) => {
      var ft = unirest('POST', 'https://sandbox.usbank.com/money-movement/rtp/v1/credit-transfers')
              .headers({
                  'Accept-Encoding': '*',
                  'Authorization': 'Bearer ' + accessToken,
                  'Correlation-ID': correlationId,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              })
              .send(getRequestPayload())
              .end(function (res) { 
                if (res.error) 
                    return reject(res.error);
                else
                    return resolve(res.body);
                });
              });
  }

  function paymentAcknowledgement(accessToken, correlationId, transactionId){
    console.log("Transaction ID: "+transactionId)
    return new Promise((resolve, reject) => {
        unirest('GET', 'https://sandbox.usbank.com/money-movement/rtp/v1/credit-transfers/'+transactionId)
            .headers({
                'Accept-Encoding': '*',
                'Authorization': 'Bearer ' + accessToken,
                'Correlation-ID': correlationId,
                'Accept': 'application/json'
            })
            .send('')
            .end(function (response) { 
              if (response.error) 
                  return reject(response.error);
              else
                  return resolve(response.body);
              });
       });
}

function getRequestPayload(){
  var payload = JSON.stringify({
    "creditTransfer": {
      "clientDetails": {
        "clientRequestID": invid
      },
      "payerDetails": {
        "name": "Zeal Inc",
        "accountNumber": acctno,
        "routingNumber": routno,
        "address": {
          "addressLine1": "100 Main St",
          "addressLine2": "Apt 116",
          "city": "Chicago",
          "state": "IL",
          "zipCode": "60606",
          "country": "US"
        }
      },
      "ultimatePayerDetails": {
        "name": "John D",
        "identifier": "12344232122",
        "address": {
          "addressLine1": "100 Main St",
          "addressLine2": "Apt 116",
          "city": "Chicago",
          "state": "IL",
          "zipCode": "60606",
          "country": "US"
        }
      },
      "payeeDetails": {
        "name": "ABC Corp",
        "accountNumber": "asd-344232122",
        "routingNumber": "091000019",
        "address": {
          "addressLine1": "100 Main St",
          "addressLine2": "Apt 116",
          "city": "Chicago",
          "state": "IL",
          "zipCode": "60606",
          "country": "US"
        }
      },
      "ultimatePayeeDetails": {
        "name": "Jim K",
        "identifier": "12344232122",
        "address": {
          "addressLine1": "100 Main St",
          "addressLine2": "Apt 116",
          "city": "Chicago",
          "state": "IL",
          "zipCode": "60606",
          "country": "US"
        }
      },
      "transactionDetails": {
        "amount": amount,
        "paymentType": "STANDARD"
      },
      "remittanceData": {
        "remittanceID": "20151112INFOABCD",
        "remittanceLocationDetails": {
          "email": "remit@healthcorp.com",
          "URI": "https://remittances/healthcorp.com"
        },
        "additionalInfo": "Unstructured remittance Information"
      }
    }
  });
  console.log("Payload for RTP Request: "+payload)
  return payload;
}

function insertRealTimePayment(transactionId, status){
   //DB insert
   let sql =  
   "insert into autorepair.realtime_payments (customerId, amount, transactionId, status)" +
   " values " +
   "(" +
     customerId +"," + amount + ", '"+ transactionId +"', '"+ status
   + "')" ;
   console.log("RTP SQL: "+sql)
   db.query(sql, (err, rows) => {
     if(err) throw err;  
     console.log("Payment record inserted for transaction: "+transactionId)
   }); 
}

  var accessToken = await getToken();
  console.log("Access token for the RTP is: "+accessToken);

  let correlationId = crypto.randomUUID();
  console.log("Correlation Id: "+correlationId)
  var ft_response = await fundtransfer(accessToken,correlationId);
  console.log(ft_response, ft_response.transactionID)

  // Sleep in case the RTP takes more time for approval.
  await sleep(500)
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  var pmt_ackResponse;
  if(ft_response && ft_response.transactionID){
    let transactionId = ft_response.transactionID;
      pmt_ackResponse = await paymentAcknowledgement(accessToken, correlationId, transactionId);
      console.log("Payment Acknowledgement Response: "+JSON.stringify(pmt_ackResponse));
      if(pmt_ackResponse && pmt_ackResponse.transactiondDetails && pmt_ackResponse.transactiondDetails.status){
        ft_response.status = pmt_ackResponse.transactiondDetails.status.statusCode;
        ft_response.reason = pmt_ackResponse.transactiondDetails.status.message;
        insertRealTimePayment(transactionId, ft_response.status);
      }
  }
  console.log("Final response: "+JSON.stringify(ft_response));
  return ft_response;
}



//This will send a message to the sales people channel to notify them that a customer has sent a payment.
const axios = require('axios');
app.get('/payment', function(request, response, next) {
  var customerId = request.query.customerId;
  var email = request.query.email;
  var creditcard = request.query.cc;
  var amount = request.query.amount;
  var date = request.query.date;
  console.log(request);
  
  axios.post(
    webhookURL,
    {
      text: 'Customer with email ' + email + ' and credit card ' + creditcard  + ' has submitted a payment of $' + amount,
    },
    {
      headers: { "content-type": "application/json" },
    }
  );

  var message = "You will be transfering an amount of $" + amount + ", to the below account number. Please check the account details and click \"Click to Pay\"";
  response.render('payments.ejs', { "message" : message, "amount": amount, "date": date , "customerId": customerId});
  response.end();
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

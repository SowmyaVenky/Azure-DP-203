const fetch = require("node-fetch");
const messageCard = require("./adaptiveCards/messageCard.json");
const vehicleCard = require("./adaptiveCards/vehicle_details.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory } = require("botbuilder");

class VRMSearchCommandHandler {
  triggerPatterns = "vrm";
  
  async getVehicleByVRM(vrm) {
    var API_BASE = ""; 

    if( process.env.REACT_APP_API_BASE == null) {
      API_BASE = "https://autosvcenterapi1001.azurewebsites.net/";
    }else {
      API_BASE = process.env.REACT_APP_API_BASE;
    }

    const response = await fetch (API_BASE + `/vehiclebyvrm?vrm=` + vrm, {
          "method": "get",
          "cache": "default"
      });
      if (response.ok) {
          const vehicleDetails = await response.json();
          return vehicleDetails;
      } else {
          const error = await response.json();
          console.log (`ERROR: ${error}`);
          throw (error);
      }
  }

  async handleCommandReceived(context, message) {
    // Search by VIN if parameters are good.
    const myArray = message.text.split(" ");

    if( myArray.length == 2 ) {
        // render your adaptive card for reply message
        const response = await this.getVehicleByVRM(myArray[1]);
        let messageToSend = "The vehicle was not found, please check your search."
        let bodyToSend = '';

        const cardData = {
          title: messageToSend,
          body: bodyToSend,
        };
        
        if( response.length > 0 ) {
          const cardJson = AdaptiveCards.declare(vehicleCard).render(response[0]);
          return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));     
        }else {
          const cardJson = AdaptiveCards.declare(messageCard).render(cardData);
          return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));     
        }
    }

    const cardData = {
      title: "Please search with the command vrm <<actual vrm number>>",
      body: "Please correct your command and try again!",
    };

    const cardJson = AdaptiveCards.declare(messageCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

module.exports = {
  VRMSearchCommandHandler
};

const fetch = require("node-fetch");
const messageCard = require("./adaptiveCards/messageCard.json");
const vehicleCard = require("./adaptiveCards/vehicle_details.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory, AttachmentLayoutTypes } = require("botbuilder");

class EmailSearchCommandHandler {
  triggerPatterns = "email";
  
  async getVehicleByEmail(email) {
    const response = await fetch (`https://autosvcenterapi1001.azurewebsites.net/vehiclebyemail?email=` + email, {
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
        const response = await this.getVehicleByEmail(myArray[1]);
        let messageToSend = "The vehicle was not found, please check your search."
        let bodyToSend = '';

        const cardData = {
          title: messageToSend,
          body: bodyToSend,
        };
        
        if( response.length > 0 ) {
          //In this case, we are going to get many service records for the customer.
          //We need to create attachment array and display as carousal.
          const attachments = [];
          //Some people have a lot of service records, carousal does not like it, 
          //So we are limiting to just 10 
          for( let x = 0; x < 10; x++ ) {
            const cardJson = AdaptiveCards.declare(vehicleCard).render(response[x]);
            attachments.push(CardFactory.adaptiveCard(cardJson));
          }     
          await context.sendActivity(
            {
              attachments : attachments,
              attachmentLayout : AttachmentLayoutTypes.Carousel 
            }
          );
          const searchResults = {
            title: response.length + ' service records found.',
            body: 'Please see details above.'
          };  
          const cardJson = AdaptiveCards.declare(messageCard).render(searchResults);
          return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
        }else {
          const cardJson = AdaptiveCards.declare(messageCard).render(cardData);
          return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));     
        }
    }

    const cardData = {
      title: "Please search with the command email <<actual email>>",
      body: "Please correct your command and try again!",
    };

    const cardJson = AdaptiveCards.declare(messageCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

module.exports = {
  EmailSearchCommandHandler
};

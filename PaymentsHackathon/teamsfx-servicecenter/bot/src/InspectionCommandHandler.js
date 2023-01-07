const fetch = require("node-fetch");
const inspectionCard = require("./adaptiveCards/inspectionCard.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory, AttachmentLayoutTypes } = require("botbuilder");

class InspectionCommandHandler {
  triggerPatterns = "inspection";
  
  async handleCommandReceived(context, message) { 
    const cardJson = AdaptiveCards.declare(inspectionCard).render({});
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

module.exports = {
  InspectionCommandHandler
};

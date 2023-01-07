const fetch = require("node-fetch");
const messageCard = require("./adaptiveCards/messageCard.json");
const { InvokeResponseFactory } = require("@microsoft/teamsfx");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory, AttachmentLayoutTypes } = require("botbuilder");

class InspectionActionHandler {
  triggerVerb = "submitinspection";
  async handleActionInvoked(context, message) {
    //The message contains the data sent to us.
    console.log(message);

    const cardData = {
      title: "Congratulations! Your inspection is processed successfully.",
      body: JSON.stringify(message),
    };

    const cardJson = AdaptiveCards.declare(messageCard).render(cardData);
    return InvokeResponseFactory.adaptiveCard(cardJson);
  }
}

module.exports = {
  InspectionActionHandler
};

const { ConversationBot } = require("@microsoft/teamsfx");
const { VINSearchCommandHandler } = require("../VINSearchCommandHandler");
const { VRMSearchCommandHandler } = require("../VRMSearchCommandHandler");
const { EmailSearchCommandHandler } = require("../EmailSearchCommandHandler");
const { InspectionCommandHandler } = require("../InspectionCommandHandler");
const { InspectionActionHandler } = require("../InspectionActionHandler");
const config = require("./config");

// Create the command bot and register the command handlers for your app.
// You can also use the commandBot.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor
const commandBot = new ConversationBot({
  // The bot id and password to create BotFrameworkAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    appId: config.botId,
    appPassword: config.botPassword,
  },
  command: {
    enabled: true,
    commands: [
      new VINSearchCommandHandler(), 
      new VRMSearchCommandHandler(),
      new EmailSearchCommandHandler(),
      new InspectionCommandHandler()
    ],
  }, 
  cardAction: {
    enabled: true,
    actions: [new InspectionActionHandler()],
  },
});

module.exports = {
  commandBot,
};

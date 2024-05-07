const {Client, IntentsBitField} = require("discord.js");
const {token, MONGODB_URI} = require("../cfg.json");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ],
});

(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
    
        eventHandler(client);

        client.login(token);
    }
    catch (e) {
        console.log(e);
    }

})();
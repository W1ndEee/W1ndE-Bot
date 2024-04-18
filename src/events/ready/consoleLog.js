const {Client, Events, GatewayIntentBits, IntentsBitField, EmbedBuilder, ActivityType} = require("discord.js");

module.exports = (client) => {
    console.log(`${client.user.tag} is online.`)

    client.user.setActivity({
        name: "Having fun!",
        type: ActivityType.Playing,
    });
};
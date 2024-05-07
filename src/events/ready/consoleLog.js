const {Client, ActivityType} = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    console.log(`${client.user.tag} is online.`)

    client.user.setActivity({
        name: "Having fun!",
        type: ActivityType.Playing,
    });
};
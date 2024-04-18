const { Client, Message } = require('discord.js');
const {bot_id} = require("../../../config.json");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;


    try {
        if (message.author.bot) {
            return;
        }
    
        //To @ Someone, use <@${message.author.id}>, to @everyone just use @everyone. To @ a role, use <@&${id(for the role)}>
        if (message.content === 'hello <@' + bot_id + '>') {
            message.reply(`Hey! <@${message.author.id}>`);
            //this works, change the channel to the required one.
            //client.channels.cache.get('1229976215134404735').send('beep boop');
            //message.channel.send('Beep boop');
        }
    }
    catch (error) {
        console.log(`There was an error running this command: ${error}`);
    }
};
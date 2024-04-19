const { Client, Message } = require('discord.js');
const {bot_id} = require("../../../config.json");
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');
const cooldowns = new Set();

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;

    const xpToGive = getRandomXp(5, 15);

    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    };

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

        const level = await Level.findOne(query);

        if (level) {
            if (cooldowns.has(message.author.id)) return;

            level.xp += xpToGive;
      
            if (level.xp > calculateLevelXp(level.level)) {
              level.xp = 0;
              level.level += 1;
      
              message.channel.send(`${message.member} you have leveled up to **level ${level.level}**.`);
            }
      
            await level.save().catch((e) => {
              console.log(`Error saving updated level ${e}`);
              return;
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
              cooldowns.delete(message.author.id);
            }, 60000);
        }

        // if (!level)
        else {
            if (cooldowns.has(message.author.id)) return;

            // create new level
            const newLevel = new Level({
            userId: message.author.id,
            guildId: message.guild.id,
            xp: xpToGive,
            });
  
            await newLevel.save();
            cooldowns.add(message.author.id);
            setTimeout(() => {
            cooldowns.delete(message.author.id);
            }, 60000);
        }
    }
    catch (error) {
        console.log(`There was an error running this command: ${error}`);
    }
};
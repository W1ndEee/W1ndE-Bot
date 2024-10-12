const { Client, Message } = require('discord.js');
const {bot_id, creator_id} = require("../../../cfg.json");
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');
const cooldowns = new Set();
const request = require('request');

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
        if (message.content === 'Hello <@' + bot_id + '>') {
            message.reply(`Hey! <@${message.author.id}>`);
            //this works, change the channel to the required one.
            //client.channels.cache.get('1229976215134404735').send('beep boop');
            //message.channel.send('Beep boop');
        }

        if (message.content === 'Introduce yourself <@' + bot_id + '>') {
            message.channel.send(`You really put me on the spot there hahah`);
            message.channel.send(`Hey everyone! I am a bot created by <@${creator_id}>!`);
            message.channel.send('I have some simple moderation commands like `/ban`, `/kick` and `/timeout`. But you have to be a mod to use them :(');
            message.channel.send('I can also automatically welcome new people to the server and give them roles!');
            message.channel.send('If you wanna check out what I can do try using `/help`');
        }

        if (message.content === 'All right thank you very much <@' + bot_id + '>') {
            message.channel.send('No worries! :)');
        }

        if (message.mentions.has(bot_id)) {
            //detects swear words in all messages
            request(`https://www.purgomalum.com/service/containsprofanity?text=${message.content.toString()}`, (error, response, body) => {
                if (body === "true") {
                    //replies with an insult
                    request(`https://insult.mattbas.org/api/insult`, (err, res, body) => {
                    message.reply(body);
                })
            }
        })
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
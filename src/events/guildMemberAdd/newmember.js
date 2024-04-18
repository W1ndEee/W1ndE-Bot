const { Client, GuildMember, PermissionFlagsBits } = require('discord.js');
const {bot_id} = require("../../../config.json");

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */

module.exports = async (client, member) => {
    try {
        let guild = member.guild;
        if (!guild) return;

        await member.roles.add('1230409603221819473');

        client.channels.cache.get('1229976215134404735').send(`Hey! <@${member.id}>`);
    }
    catch (e) {
        console.log(`There was an error running this command: ${e}`);
    }

};
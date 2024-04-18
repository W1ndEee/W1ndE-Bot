const { Client, GuildMember, PermissionFlagsBits } = require('discord.js');
const {autorole_role, welcome_message_channel} = require("../../../config.json");

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */

module.exports = async (client, member) => {
    try {
        let guild = member.guild;
        if (!guild) return;

        await member.roles.add(autorole_role);

        client.channels.cache.get(welcome_message_channel).send(`Welcome to ${member.guild.name} <@${member.id}>! We now have **${member.guild.memberCount}** members!`);
    }
    catch (e) {
        console.log(`There was an error running this command: ${e}`);
    }

};
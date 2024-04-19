const { Client, GuildMember } = require('discord.js');
const Welcome = require('../../models/Welcome');
const AutoRole = require('../../models/AutoRole');

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */

module.exports = async (client, member) => {

    const query = {
        guildId: member.guild.id,
    };

    try {
        let guild = member.guild;
        if (!guild) return;

        try {
            const autorole = await AutoRole.findOne(query);

            //There is autorole on the server
            if (autorole) {
                if (!autorole.enabled) {

                }
                else {
                    await member.roles.add(autorole.role);
                }
            }

            else {

            }
        }
        catch (e) {
            console.log(e);
        }
        
        const welcome = await Welcome.findOne(query);

        //the welcome message exists for the server
        if (welcome) {

            //The welcome message has been disabled.
            if (!welcome.enabled) {
                return;
            }

            //replace the placeholders
            let message = welcome.wmessage
            .replace('{GUILD_NAME}', member.guild.name)
            .replace('{MENTION}', `<@${member.id}>`)
            .replace('{COUNT}', member.guild.memberCount);

            //send the message
            client.channels.cache.get(welcome.wchannel).send(message);
        }
        
        //the welcome message doesn't exist and the default one needs to be used. (THIS WILL NEED TO BE DELETED)
        else {
            return;
        }
    }
    catch (e) {
        console.log(`There was an error running this command: ${e}`);
    }

};
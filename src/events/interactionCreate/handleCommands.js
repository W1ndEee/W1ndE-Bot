const { Client, Interaction } = require('discord.js');
const {devs, testserver} = require('../../../cfg.json');
const getLocalCommands = require('../../utils/getLocalCommands');

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 * @returns 
 */


module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) {
        if (interaction.isButton()) {
            try {
                const localCommands = getLocalCommands();

                const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

                if (!commandObject) return;

                await commandObject.callback(client, interaction);
                return;
            }
            catch (e) {
                console.log(e);
            }
        }
    }


    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: 'Only developers are allowed to run this command.',
                    ephemeral: true,

                });
                return;
            }

        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testserver)) {
                interaction.reply({
                    content: 'This command cannot be ran here.',
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: 'Not enough permissions.',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    }
    catch (error) {
        console.log(`There was an error running this command: ${error}`)
    }
};
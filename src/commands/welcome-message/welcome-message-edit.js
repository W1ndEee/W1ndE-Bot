const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Welcome = require('../../models/Welcome');

module.exports = {
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }

        const query = {
            guildId: interaction.guild.id,
        };

        try {
            const welcome = await Welcome.findOne(query);

            const message = interaction.options.get('message')?.value;
            const channel = interaction.options.get('channel')?.value;

            await interaction.deferReply();

            //if a welcome message does not exist for the server
            if (!welcome) {
                interaction.editReply('A welcome message does not exist yet! Use welcome-message-create to create one now!');
                return;
            }
            //the welcome message does exist
            else {
                //if the user wants to change the message and channel
                if (message && channel) {
                    welcome.wmessage = message;
                    welcome.wchannel = channel;
                    interaction.editReply(`The message has been changed to:\n
                    ${message}\n
                    The channel has been updated to: https://discord.com/channels/${interaction.guild.id}/${channel}`);
                }
                //if the user wants to only change the message
                else if (message && !channel) {
                    welcome.wmessage = message;
                    interaction.editReply(`The message has been changed to:\n
                    ${message}`);
                }
                //if the user only wants to change the channel
                else if (channel && !message) {
                    welcome.wchannel = channel;
                    interaction.editReply(`The channel has been updated to: https://discord.com/channels/${interaction.guild.id}/${channel}`);
                }
                //the user provided nothing
                else {
                    interaction.editReply('You have not provided any changes. Please try again.');
                }

                await welcome.save().catch((e) => {
                    console.log(`Error saving updated welcome message ${e}`);
                    return;
                });
                
                return;
            }
        }
        catch (e) {
            console.log(e);
        }
    },

    name: 'welcome-message-edit',
    description: 'Edit the welcome message and/or the channel. Check /help for placeholders.',
    options: [
        {
            name: 'message',
            description: 'The message that is displayed. Check /help for placeholders.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'channel',
            description: 'The channel that you want the message to display in',
            type: ApplicationCommandOptionType.Channel,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers]
}
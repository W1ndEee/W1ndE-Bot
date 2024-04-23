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

        try {
            await interaction.deferReply();

            const message = interaction.options.get('message').value;
            const channel = interaction.options.get('channel').value;
    
            const fetchedWelcome = await Welcome.findOne({
                guildId: interaction.guild.id
            });
    
            //if it is found
            if (fetchedWelcome) {
                interaction.editReply('A welcome message already exists! Use welcome-message-edit instead!');
                return;
            }
            
            //not found
            else {
                //create new welcome
                const newWelcome = new Welcome({
                    guildId: interaction.guild.id,
                    wchannel: channel,
                    wmessage: message,
                });
    
                await newWelcome.save();
                interaction.editReply(`Successfully created the welcome message:\n
                ${message}\nIn https://discord.com/channels/${interaction.guild.id}/${channel} !`);
                return;
            }
        }
        catch (e) {
            console.log(e);
        }
    },

    name: 'welcome-message-create',
    description: 'Create the welcome message that is shown when a user joins the server. Check /help for placeholders.',
    devOnly: true,
    options: [
        {
            name: 'message',
            description: 'The message that is displayed. Check /help for placeholders.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'channel',
            description: 'The channel that you want the message to display in',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator]
}
const { Client, Interaction, Events, GatewayIntentBits, IntentsBitField, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const message = interaction.options.get('message').value;

        
    },

    name: 'welcome-message',
    description: 'Edit the welcome message that is shown when a user joins the server',
    devOnly: true,
    options: [
        {
            name: 'message',
            description: 'The message that is displayed',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ]
}
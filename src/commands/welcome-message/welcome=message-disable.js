const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const Welcome = require('../../models/Welcome');

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {

        const query = {
            guildId: interaction.guild.id,
        };

        const welcome = await Welcome.findOne(query);

        await interaction.deferReply();

        if (!welcome) {
            interaction.editReply('You have not created a welcome message yet.');
            return;
        }

        if (!welcome.enabled) {
            interaction.editReply('The welcome message is already disabled.')
            return;
        }
        else {
            welcome.enabled = false;
            await welcome.save().catch((e) => {
                console.log(`Error saving updated welcome message ${e}`);
                return;
            });
            interaction.editReply('The welcome message has been disabled. To re-enable, use welcome-message-enable');
            return;
        }
    },

    name: 'welcome-message-disable',
    description: 'Disable the welcome message.',
    permissionsRequired: [PermissionFlagsBits.Administrator]
}
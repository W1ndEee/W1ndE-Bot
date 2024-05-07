const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

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

        const fetchedAutoRole = await AutoRole.findOne({
          guildId: interaction.guild.id,
        });

        //autorole doesn't exist in the server
        if (!fetchedAutoRole) {
          interaction.editReply('AutoRole has not been created on this server yet');
          return;
        }

        if (!fetchedAutoRole.enabled) {
            interaction.editReply('AutoRole is already disabled');
            return;
        }

        else {
            fetchedAutoRole.enabled = false;
            await fetchedAutoRole.save();
            interaction.editReply('The AutoRole has been disabled. To re-enable, use autorole-enable');
            return;
        }
      }
      catch (e) {
        console.log(e);
      } 
    },

    name: 'autorole-disable',
    description: 'Disable AutoRole',
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles]
}
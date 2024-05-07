const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
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

        const nrole = interaction.options.get('role').value;

        const fetchedAutoRole = await AutoRole.findOne({
          guildId: interaction.guild.id,
        });

        //autorole doesn't exist in the server
        if (!fetchedAutoRole) {
          interaction.editReply('AutoRole has not been created on this server yet');
          return;
        }
        //exists
        else {
          //create new
          fetchedAutoRole.role = nrole;
          await fetchedAutoRole.save();
          interaction.editReply('Successfully changed the AutoRole role.');
          return;
        }
      }
      catch (e) {
        console.log(e);
      } 
    },

    name: 'autorole-edit',
    description: 'Change the role of the AutoRole',
    options: [
        {
          name: 'role',
          description: 'Choose the role to change to',
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
      ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles]
}
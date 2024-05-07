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

        //found
        if (fetchedAutoRole) {
          interaction.editReply('Autorole is already created.');
          return;
        }

        //not found
        else {
          //create new
          const newAutoRole = new AutoRole({
            guildId: interaction.guild.id,
            role: nrole,
          });

          await newAutoRole.save();
          interaction.editReply('Successfully created AutoRole.');
          return;
        }
      }
      catch (e) {
        console.log(e);
      } 
    },

    name: 'autorole-create',
    description: 'Let the bot automatically give the new user a role!',
    options: [
        {
          name: 'role',
          description: 'Choose the role from below',
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
      ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles]
}
const { Client, Interaction } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        try {
            if (!interaction.isButton()) return;
            await interaction.deferReply({ ephemeral: true });
        
            const role = interaction.guild.roles.cache.get(interaction.customId);
            if (!role) {
              interaction.editReply("I couldn't find that role");
              return;
            }
        
            const hasRole = interaction.member.roles.cache.has(role.id);
        
            if (hasRole) {
              await interaction.member.roles.remove(role);
              await interaction.editReply(`The role ${role} has been removed.`);
              return;
            }
        
            await interaction.member.roles.add(role);
            await interaction.editReply(`The role ${role} has been added.`);
          } catch (error) {
            console.log(error);
          }
    },

    ignore: true,
}
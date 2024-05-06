const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const Twitch = require('../../models/Twitch');
const TwitchApi = require('node-twitch').default;
const { twtichclient_id, twitchclient_secret } = require('../../../cfg.json');


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

        const twitch = new TwitchApi({
            client_id: twtichclient_id,
            client_secret: twitchclient_secret
        });

        try {
            await interaction.deferReply();

            const fetchedTwitch = await Twitch.findOne({
                guildId: interaction.guild.id,
            });

            //a twitch notification IS NOT set up on the server.
            if (!fetchedTwitch) {
                interaction.editReply('A Twitch notification has not yet been set up.');
                return;
            }
            //a twitch notification IS set up on the server.
            else {
                await Twitch.deleteOne({
                    guildId: interaction.guild.id,
                });

                interaction.editReply('The Twitch notification has been removed.');
                return;
            }
        }
        catch (e) {
            console.log(e);
        }



    },

    name: 'twitch-notification-remove',
    description: 'Remove the linked twitch channel for Twitch Notifications',
    // devOnly: Boolean,
    // deleted: Boolean,
}
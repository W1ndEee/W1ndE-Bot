const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const Twitch = require('../../models/Twitch');
const TwitchApi = require('node-twitch').default;
const { twtichclient_id, twitchclient_secret } = require('../../../config.json');


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

        function isEmpty(val) {
            if (val === undefined || val == null || val.length <= 0) {
                return true;
            }
            else {
                return false;
            }
        }

        try {
            await interaction.deferReply();

            const twchannel = interaction.options.get('twitch-channel').value;
            const sechannel = interaction.options.get('notification-channel').value;

            const users = await twitch.getUsers(twchannel);
            const user = users.data[0];

            if(!isEmpty(user)) {
                const fetchedTwitch = await Twitch.findOne({
                    guildId: interaction.guild.id,
                });
    
                if (fetchedTwitch) {
                    interaction.editReply('A Twitch notification is already set up. Use twitch-notifications-edit instead.');
                    return;
                }
    
                else {
                    const newTwitch = new Twitch({
                        guildId: interaction.guild.id,
                        tchannel: twchannel,
                        schannel: sechannel,
                    });
    
                    await newTwitch.save();
                    interaction.editReply(`Successfully created the Twitch notification for ${user.display_name} in https://discord.com/channels/${interaction.guild.id}/${sechannel} !`);
                    return;
                }
            }
            else {
                interaction.editReply('This Twitch channel does not exist. Please try again.');
                return;
            }
        }
        catch (e) {
            console.log(e);
        }



    },

    name: 'twitch-notification-create',
    description: 'Link a Twitch channel to the bot and have the bot display notifications when the channel is live.',
    options: [
        {
            name: 'twitch-channel',
            description: 'The channel of the Twitch streamer you want to check. (i.e. xqc, shroud)',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'notification-channel',
            description: 'The channel in this server that you want the notifications to show up in.',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ]
    // devOnly: Boolean,
    // deleted: Boolean,
}
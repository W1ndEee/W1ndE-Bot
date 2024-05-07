const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
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

            const twchannel = interaction.options.get('twitch-channel')?.value;
            const sechannel = interaction.options.get('notification-channel')?.value;

            const fetchedTwitch = await Twitch.findOne({
                guildId: interaction.guild.id,
            });
            
            //if a twitch notification already exists for the server
            if (!fetchedTwitch) {
                interaction.editReply('A Twitch notification has not yet been set up. Use twitch-notifications-create instead.');
                return;
            }

            //a twitch notifications DOES exist
            else {

                //if the user inputted the twitch channel AND notification channel
                if (twchannel && sechannel) {
                    const users = await twitch.getUsers(twchannel);
                    const user = users.data[0];

                    if (!isEmpty(user)) {
                        fetchedTwitch.tchannel = twchannel;
                        fetchedTwitch.schannel = sechannel;

                        interaction.editReply(`Successfully updated the Twitch notification to ${user.display_name} in https://discord.com/channels/${interaction.guild.id}/${sechannel} !`);
                    }
                    else {
                        interaction.editReply('This Twitch channel does not exist. Please try again.');
                        return;
                    }
                }

                //if the user inputted twitch channel but no notification channel
                else if (twchannel && !sechannel) {
                    const users = await twitch.getUsers(twchannel);
                    const user = users.data[0];

                    if (!isEmpty(user)) {
                        fetchedTwitch.tchannel = twchannel;
                        
                        interaction.editReply(`Successfully updated the Twitch notification to ${user.display_name}!`);
                    }
                    else {
                        interaction.editReply('This Twitch channel does not exist. Please try again.');
                        return;
                    }
                }
                
                //if the user inputted notification channel but not twitch channel
                else if (!twchannel && sechannel) {
                    fetchedTwitch.schannel = sechannel;
                    interaction.editReply(`Successfully updated the Twitch notification to https://discord.com/channels/${interaction.guild.id}/${sechannel} !`);
                }

                //the user provided nothing
                else {
                    interaction.editReply('You have not provided any changes. Please try again.');
                    return;
                }

                await fetchedTwitch.save().catch((e) => {
                    console.log(`Error saving updated twitch notification ${e}`);
                    return;
                });
            }
            
        }
        catch (e) {
            console.log(e);
        }
    },

    name: 'twitch-notification-edit',
    description: 'Edit the channel and/or notificatiion channel for Twitch Notifications',
    options: [
        {
            name: 'twitch-channel',
            description: 'The channel of the Twitch streamer you want to check. (i.e. xqc, shroud)',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'notification-channel',
            description: 'The channel in this server that you want the notifications to show up in.',
            type: ApplicationCommandOptionType.Channel,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers]
}
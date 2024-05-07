const { Client, Interaction, ApplicationCommandOptionType} = require('discord.js');
const TwitchApi = require('node-twitch').default;
const { twtichclient_id, twitchclient_secret } = require('../../../cfg.json');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {

        const uchannel = interaction.options.get('channel').value;

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

        await interaction.deferReply();

        async function getStream() {
            try {

                const streams = await twitch.getStreams({channel: uchannel});
                const stream = streams.data[0];

                //streamer is live
                if (!isEmpty(stream)) {
                    await interaction.editReply(`${stream.user_name} is currently live at https://twitch.tv/${stream.user_login} !`);
                    return;
                }
                else {
                    await interaction.editReply(`${uchannel} is currently offline.`);
                    return;
                }
            }
            catch (e) {
                console.log(e);
                await interaction.editReply('The channel does not exist or another error has occured. Please check that the channel name is correct.');
                return;
            }
        }

        getStream();
    },

    name: 'islive',
    description: 'Check whether or not a Twitch streamer is currently Live.',
    options: [
        {
            name: 'channel',
            description: 'The channel of the Twitch streamer you want to check. (i.e. xqc, shroud)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
    // devOnly: Boolean,
    // deleted: Boolean,
}
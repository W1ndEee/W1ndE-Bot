const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const TwitchApi = require('node-twitch').default;
const { twtichclient_id, twitchclient_secret } = require('../../../config.json');

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

        function URLreplace(url) {
            let URL = url
            .replace('{width}', '1980')
            .replace('{height}', '1080');
            return URL;
        }

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
                console.log(stream);
                if (isEmpty(stream)) {
                    console.log('Offline.');
                    const users = await twitch.getUsers(uchannel);
                    const user = users.data[0];
                    await interaction.editReply(`${uchannel} is currently offline.
                    ${URLreplace(user.profile_image_url)}`);
                    return;
                }
                else {
                    await interaction.editReply(`${stream.user_name} is currently live at https://twitch.tv/${stream.user_login} !\n
                    ${URLreplace(stream.thumbnail_url)}`);
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
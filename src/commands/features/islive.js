const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
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

        function iso(isoTimestamp) {
            const unixTimestamp = Math.floor(new Date(isoTimestamp).getTime() / 1000);
            return `<t:${unixTimestamp}:R>`;
          }

        await interaction.deferReply();

        async function getStream() {
            try {

                const streams = await twitch.getStreams({channel: uchannel});
                const stream = streams.data[0];

                const users = await twitch.getUsers(uchannel);
                const user = users.data[0];

                if (!isEmpty(stream)) {

                    const twitchembed = new EmbedBuilder()
                    .setColor('DarkPurple')
                    .setAuthor({
                        name: `${user.display_name} is now live!`,
                        iconURL: user.profile_image_url,
                    })
                    .setTitle(`${stream.title}`)
                    .setURL(`https://twitch.tv/${stream.user_login}`)
                    .setImage(URLreplace(stream.thumbnail_url))
                    .addFields([
                        {
                            name: '**Live since**',
                            value: `${iso(stream.started_at)}`,
                            inline: true,
                        },
                        {
                            name: '**Playing**',
                            value: stream.game_name,
                            inline: true,
                        }
                    ])
                    .setThumbnail(user.profile_image_url)
                    .setFooter({
                        text: 'Live notifications by W1ndE bot',
                        iconURL: interaction.client.user.displayAvatarURL(),
                    });

                    const row = new ActionRowBuilder();

                    row.components.push(
                        new ButtonBuilder()
                        .setURL(`https://twitch.tv/${stream.user_login}`)
                        .setLabel('📹 Watch now!')
                        .setStyle(ButtonStyle.Link)
                    );

                    await interaction.editReply({
                        embeds: [twitchembed],
                        components: [row],
                    });

                    //await interaction.editReply(`${stream.user_name} is currently live at https://twitch.tv/${stream.user_login} !\n${URLreplace(stream.thumbnail_url)}`);
                    return;
                }
                else {
                    await interaction.editReply(`${uchannel} is currently offline.\n${URLreplace(user.profile_image_url)}`);
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
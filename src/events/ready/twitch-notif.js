const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild} = require('discord.js');
const TwitchApi = require('node-twitch').default;
const { twtichclient_id, twitchclient_secret } = require('../../../config.json');
const Twitch = require('../../models/Twitch');

/**
 * 
 * @param {Client} client 
 */

module.exports = async (client) => {
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

    

    client.guilds.cache.forEach(async guild => {
        const query = {
            guildId: guild.id,
        }

        let foundlive = false;

        async function checklive() {
            try {

                const ttv = await Twitch.findOne(query);
    
                if (ttv) {
                    const channel = client.channels.cache.get(ttv.schannel);
                    if (!channel) return;
    
                    const streams = await twitch.getStreams({channel: ttv.tchannel});
                    const stream = streams.data[0];
        
                    const users = await twitch.getUsers(ttv.tchannel);
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
                            iconURL: client.user.displayAvatarURL(),
                        });
        
                        const row = new ActionRowBuilder();
        
                        row.components.push(
                            new ButtonBuilder()
                            .setURL(`https://twitch.tv/${stream.user_login}`)
                            .setLabel('📹 Watch now!')
                            .setStyle(ButtonStyle.Link)
                        );
        
                        await 
                        await channel.send({
                            embeds: [twitchembed],
                            components: [row],
                        });
        
                        //await interaction.editReply(`${stream.user_name} is currently live at https://twitch.tv/${stream.user_login} !\n${URLreplace(stream.thumbnail_url)}`);
                        foundlive = true;
                        return;
                    }
                    else {
                        await channel.send(`${ttv.tchannel} is currently offline.\n${URLreplace(user.profile_image_url)}`);
                        return;
                    } 
                }
            }
            catch (e) {
                console.log(e);
                return;
            }
            finally {
                if (!foundlive) {
                    setTimeout(checklive, 10000);
                }
            }
        }

        checklive();
    });
}
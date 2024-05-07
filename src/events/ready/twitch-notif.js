const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType} = require('discord.js');
const TwitchApi = require('node-twitch').default;
const { twtichclient_id, twitchclient_secret } = require('../../../cfg.json');
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
        .replace('{width}', '1920')
        .replace('{height}', '1080');
        return URL;
    }

    function VODURLreplace(url) {
        let URL = url
        .replace('%{width}', '1920')
        .replace('%{height}', '1080');
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




    /*


    ////////////////////////////////////////////////////// FOR CACHED GUILDS //////////////////////////////////////////////////////


    */

    client.guilds.cache.forEach(async guild => {

        let lastStreamID = 0;
        let status = false;
        let laststatus = false;
        let livemsg;
        let streamerid;
        let streamid;
        let streamtitle;
        let streamurl;
        let gamename;
        let ownerstreaming = false;

        async function checklive(guild) {
            const query = {
                guildId: guild.id,
            }
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
                        if (stream.id != lastStreamID) {

                            //check if the stream title is null
                            if (isEmpty(stream.title)) {
                                streamtitle = '  ';
                            }
                            //stream title is not null
                            else {
                                streamtitle = stream.title;
                            }

                            //check if the game name is null
                            if (isEmpty(stream.game_name)) {
                                gamename = '  ';
                            }
                            //game name is not null
                            else {
                                gamename = stream.game_name;
                            }

                            const twitchembed = new EmbedBuilder()
                            .setColor('DarkPurple')
                            .setAuthor({
                                name: `${user.display_name} is now live!`,
                                iconURL: user.profile_image_url,
                            })
                            .setTitle(`${streamtitle}`)
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
                                    value: `${gamename}`,
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
                            
                            livemsg = await channel.send({
                                content: `@everyone, ${stream.user_name} is now live! https://twitch.tv/${stream.user_login}`,
                                embeds: [twitchembed],
                                components: [row],
                            });
            
                            lastStreamID = stream.id;
                            status = true;
                            laststatus = true;
                            streamerid = stream.user_id;
                            streamid = stream.id;
                            streamurl = `https://twitch.tv/${stream.user_login}`;

                            if (stream.user_login === 'w1ndeee') {
                                ownerstreaming = true;
                                client.user.setActivity({
                                    name: "Watching W1ndEee's Stream!",
                                    type: ActivityType.Streaming,
                                    url: 'https://www.twitch.tv/w1ndeee',
                                });
                            }
                        }

                        
                    }
                    else {
                        lastStreamID = 0;
                        status = false;
                        //last status was live
                        if (laststatus && !status) {
                            //if the owner was streaming
                            if (ownerstreaming) {
                                client.user.setActivity({
                                    name: "Having fun!",
                                    type: ActivityType.Playing,
                                });
                                ownerstreaming = false;
                            }

                            //API CALL FOR VOD
                            const vids = await twitch.getVideos({
                                user_id: streamerid,
                                type: 'archive',
                            });
                            let vod;
                            for (i = 0; i < vids.data.length; i++) {
                                if (vids.data[i].stream_id === streamid) {
                                    vod = vids.data[i];
                                }
                            }
                            //if the vod exists
                            if (!isEmpty(vod)) {
                                const newtwitchembed = new EmbedBuilder()
                                .setColor('DarkPurple')
                                .setAuthor({
                                    name: `${user.display_name} is now offline.`,
                                    iconURL: user.profile_image_url,
                                })
                                .setTitle(`${streamtitle}`)
                                .setURL(`${vod.url}`)
                                .setImage(VODURLreplace(vod.thumbnail_url))
                                .addFields([
                                    {
                                        name: '**VOD Duration**',
                                        value: vod.duration,
                                        inline: true,
                                    },
                                ])
                                .setThumbnail(URLreplace(user.profile_image_url))
                                .setFooter({
                                    text: 'Live notifications by W1ndE bot',
                                    iconURL: client.user.displayAvatarURL(),
                                });
                
                                const newrow = new ActionRowBuilder();
                
                                newrow.components.push(
                                    new ButtonBuilder()
                                    .setURL(`${vod.url}`)
                                    .setLabel('📹 Watch VOD on Twitch!')
                                    .setStyle(ButtonStyle.Link)
                                );
    
                                //edit the message
                                livemsg.edit({
                                    embeds: [newtwitchembed],
                                    components: [newrow],
                                });
                            }
                            //VOD DOES NOT EXIST
                            else {
                                const newtwitchembed = new EmbedBuilder()
                                .setColor('DarkPurple')
                                .setAuthor({
                                    name: `${user.display_name} is now offline.`,
                                    iconURL: user.profile_image_url,
                                })
                                .setTitle(`${streamtitle}`)
                                .setURL(`${streamurl}`)
                                .setFooter({
                                    text: 'Live notifications by W1ndE bot',
                                    iconURL: client.user.displayAvatarURL(),
                                });
    
                                //edit the message
                                livemsg.edit({
                                    embeds: [newtwitchembed],
                                    components: [],
                                });
                            }
                        }
                    } 
                }
            }
            catch (e) {
                console.log(e);
                return;
            }
            finally {
                setTimeout(() => checklive(guild), 30000);
            }
        }

        checklive(guild);
    });
    






    /*


    ////////////////////////////////////////////////////// FOR NEW GUILDS //////////////////////////////////////////////////////


    */

    //when the bot is added to a new server
    client.on('guildCreate', async (guild) => {
        let lastStreamID = 0;
        let status = false;
        let laststatus = false;
        let livemsg;
        let streamerid;
        let streamid;
        let streamtitle;
        let streamurl;
        let gamename;

        async function checklive(guild) {
            const query = {
                guildId: guild.id,
            }
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
                        if (stream.id != lastStreamID) {

                            //check if the stream title is null
                            if (isEmpty(stream.title)) {
                                streamtitle = '  ';
                            }
                            //stream title is not null
                            else {
                                streamtitle = stream.title;
                            }

                            //check if the game name is null
                            if (isEmpty(stream.game_name)) {
                                gamename = '  ';
                            }
                            //game name is not null
                            else {
                                gamename = stream.game_name;
                            }

                            const twitchembed = new EmbedBuilder()
                            .setColor('DarkPurple')
                            .setAuthor({
                                name: `${user.display_name} is now live!`,
                                iconURL: user.profile_image_url,
                            })
                            .setTitle(`${streamtitle}`)
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
                                    value: `${gamename}`,
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
                            
                            livemsg = await channel.send({
                                content: `@everyone, ${stream.user_name} is now live! https://twitch.tv/${stream.user_login}`,
                                embeds: [twitchembed],
                                components: [row],
                            });
            
                            lastStreamID = stream.id;
                            status = true;
                            laststatus = true;
                            streamerid = stream.user_id;
                            streamid = stream.id;
                            streamurl = `https://twitch.tv/${stream.user_login}`;

                            //IF THE OWNER IS STREAMING
                            if (stream.user_login === 'w1ndeee') {
                                ownerstreaming = true;
                                client.user.setActivity({
                                    name: "Watching W1ndEee's Stream!",
                                    type: ActivityType.Streaming,
                                    url: 'https://www.twitch.tv/w1ndeee',
                                });
                            }
                        }

                        
                    }
                    else {
                        lastStreamID = 0;
                        status = false;
                        //last status was live
                        if (laststatus && !status) {
                            //if the owner was streaming
                            if (ownerstreaming) {
                                client.user.setActivity({
                                    name: "Having fun!",
                                    type: ActivityType.Playing,
                                });
                                ownerstreaming = false;
                            }

                            //API CALL FOR VOD
                            const vids = await twitch.getVideos({
                                user_id: streamerid,
                                type: 'archive',
                            });
                            let vod;
                            for (i = 0; i < vids.data.length; i++) {
                                if (vids.data[i].stream_id === streamid) {
                                    vod = vids.data[i];
                                }
                            }
                            //if the vod exists
                            if (!isEmpty(vod)) {
                                const newtwitchembed = new EmbedBuilder()
                                .setColor('DarkPurple')
                                .setAuthor({
                                    name: `${user.display_name} is now offline.`,
                                    iconURL: user.profile_image_url,
                                })
                                .setTitle(`${streamtitle}`)
                                .setURL(`${vod.url}`)
                                .setImage(VODURLreplace(vod.thumbnail_url))
                                .addFields([
                                    {
                                        name: '**VOD Duration**',
                                        value: vod.duration,
                                        inline: true,
                                    },
                                ])
                                .setThumbnail(URLreplace(user.profile_image_url))
                                .setFooter({
                                    text: 'Live notifications by W1ndE bot',
                                    iconURL: client.user.displayAvatarURL(),
                                });
                
                                const newrow = new ActionRowBuilder();
                
                                newrow.components.push(
                                    new ButtonBuilder()
                                    .setURL(`${vod.url}`)
                                    .setLabel('📹 Watch VOD on Twitch!')
                                    .setStyle(ButtonStyle.Link)
                                );
    
                                //edit the message
                                livemsg.edit({
                                    embeds: [newtwitchembed],
                                    components: [newrow],
                                });
                            }
                            //VOD DOES NOT EXIST
                            else {
                                const newtwitchembed = new EmbedBuilder()
                                .setColor('DarkPurple')
                                .setAuthor({
                                    name: `${user.display_name} is now offline.`,
                                    iconURL: user.profile_image_url,
                                })
                                .setTitle(`${streamtitle}`)
                                .setURL(`${streamurl}`)
                                .setFooter({
                                    text: 'Live notifications by W1ndE bot',
                                    iconURL: client.user.displayAvatarURL(),
                                });
    
                                //edit the message
                                livemsg.edit({
                                    embeds: [newtwitchembed],
                                    components: [],
                                });
                            }
                        }
                    } 
                }
            }
            catch (e) {
                console.log(e);
                return;
            }
            finally {
                setTimeout(() => checklive(guild), 30000);
            }
        }

        checklive(guild);
    });
}
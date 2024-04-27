const {Client, Events, GatewayIntentBits, IntentsBitField, EmbedBuilder, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {token, guild_id, bot_id} = require("./cfg.json");
const eventHandler = require("./src/handlers/eventHandler");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const roles = [
    {
        id: '1230464040866811914',
        label: 'Verify'
    },
];

client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1230508971144515660');
        if (!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            );
        });

        await channel.send({
            content: 'Click the button below to get access to all channels!',
            components: [row],
        });
        process.exit();
    }
    catch (e) {
        console.log(`Error: ${e}`);
    }
});

client.login(token);

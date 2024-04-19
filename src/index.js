const {Client, Events, GatewayIntentBits, IntentsBitField, EmbedBuilder, ActivityType} = require("discord.js");
const {testbot_token, guild_id, bot_id, MONGODB_URI} = require("../config.json");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');
    
        eventHandler(client);

        client.login(testbot_token);
    }
    catch (e) {
        console.log(e);
    }

})();


/*
client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);

    client.user.setActivity({
        name: "Having fun!",
        type: ActivityType.Playing,
    });
});

client.on('messageCreate', (message) => {

    console.log(message.content);

    if (message.author.bot) {
        return;
    }

    //To @ Someone, use <@${message.author.id}>, to @everyone just use @everyone. To @ a role, use <@&${id(for the role)}>
    if (message.content === 'hello <@' + bot_id + '>') {
        message.reply(`Hey! <@${message.author.id}>`);
    }
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === 'hey') {
        interaction.reply('Hey!');
    }

    if (interaction.commandName === 'ping') {
        interaction.reply('Pong!');
    }

    if (interaction.commandName === 'add') {
        const num1 = interaction.options.get('first-number').value;
        const num2 = interaction.options.get('second-number').value;

        interaction.reply(`The sum is ${num1 + num2}`);
    }

    if (interaction.commandName === 'embed') {
        const embed = new EmbedBuilder()
        .setTitle("Embed title.")
        .setDescription("This is a description!")
        .setColor('Random')
        .addFields({name: 'Field title', value: 'Some random value', inline: true});

        interaction.reply({embeds: [embed]});
    }
});

client.on('messageCreate', (message) => {
    console.log(message.content);

    if (message.author.bot) {
        return;
    }

    //To @ Someone, use <@${message.author.id}>, to @everyone just use @everyone. To @ a role, use <@&${id(for the role)}>
    if (message.content === 'hello <@' + bot_id + '>') {
        message.reply(`Hey! <@${message.author.id}>`);
    }
});

client.on('guildMemberAdd', (newmember) => {
    console.log(newmember.displayName);
});
*/


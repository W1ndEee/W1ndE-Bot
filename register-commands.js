const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');
const {token, guild_id, bot_id} = require("./cfg.json");

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey!',
    },
    {
        name: 'ping',
        description: 'Pong!',
    },
    {
        name: 'add',
        description: 'Adds two numbers.',
        options: [
            {
                name: 'first-number',
                description: 'The first number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'second-number',
                description: 'The second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ]
    },
    {
        name: 'embed',
        description: 'Sends an embed!',
    },
];

const rest = new REST({version: '10'}).setToken(token);

(async () => {
    try {
        console.log('Registering slash commands....');


        await rest.put(
            Routes.applicationGuildCommands(bot_id, guild_id),
            { body: commands}
        )

        console.log('Commands were registered successfully!');
    }
    catch (error) {
        console.log(error);
    }
})();
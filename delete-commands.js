const {REST, Routes} = require('discord.js');
const {testbot_token, guild_id, bot_id} = require("./config.json");

const rest = new REST({version: '10'}).setToken(testbot_token);

rest.delete(Routes.applicationGuildCommand(bot_id, guild_id, '1230673964565663764'))
.then(() => console.log('Successfully deleted guild command!'))
.catch(console.error);
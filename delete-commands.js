const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');
const {token, guild_id, bot_id} = require("./config.json");

const rest = new REST({version: '10'}).setToken(token);

rest.delete(Routes.applicationGuildCommand(bot_id, guild_id, '1230015938892664832'))
.then(() => console.log('Successfully deleted guild command!'))
.catch(console.error);
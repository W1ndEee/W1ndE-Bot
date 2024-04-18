const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const command = interaction.options.get('command')?.value;

        if (command) {
            try {
                if (command === 'ban') {
                    interaction.reply('Bans the target user. The target user is decided via the target-user field. A reason field for the reason behind the ban is optionally included.');
                }
                else if (command === 'kick') {
                    interaction.reply('Kicks the target user. The target user is decided via the target-user field. A reason field for the reason behind the kick is optionally included.');
                }
                else if (command === 'timeout') {
                    interaction.reply('Times out the target user. The target user is decided via the target-user field. A reason field for the timeout behind the kick is optionally included.');
                }
                else if (command === 'ping') {
                    interaction.reply('Displays the client ping and the websocket ping.');
                }
                else {
                    interaction.reply('Not a valid command.');
                }
            }
            catch (error) {
                console.log(`An error occured when performing this action: ${error}`);
            }
        }
        else {
            interaction.reply(
                '`/ban`: Bans the target user. The target user is decided via the target-user field. A reason field for the reason behind the ban is optionally included.\n\n`/kick`: Kicks the target user. The target user is decided via the target-user field. A reason field for the reason behind the kick is optionally included.\n\n`/timeout`: Times out the target user. The target user is decided via the target-user field. A reason field for the timeout behind the kick is optionally included.\n\n`/timeout`: Displays the client ping and the websocket ping.\n\n`/help`: Hey, that is me!'
            );
        }
    },

    name: 'help',
    description: 'Help with the commands I can do!',
    // devOnly: Boolean,
    options: [
        {
            name: 'command',
            description: 'Get help for a specific command (ban, kick, timeout, ping).',
            type: ApplicationCommandOptionType.String,
        }
    ],
    // deleted: Boolean,
}
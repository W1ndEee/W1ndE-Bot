const { Client, Interaction, ApplicationCommandOptionType, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const request = require('request');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const user = interaction.options.getMentionable('user');

        if (user.user.bot) {
            return interaction.reply({ content: 'You cannot insult a bot!', ephemeral: true });
        }

        const languageSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-language')
            .setPlaceholder('Select a language')
            .addOptions([
                {
                    label: 'English',
                    value: 'en',
                },
                {
                    label: 'Chinese',
                    value: 'cn',
                },
                {
                    label: 'Russian',
                    value: 'ru',
                },
                {
                    label: 'Spanish',
                    value: 'es',
                },
                {
                    label: 'French',
                    value: 'fr',
                },
                {
                    label: 'German',
                    value: 'de',
                },
                {
                    label: 'Korean',
                    value: 'ko',
                },
                // Add more as needed
            ]);
        
        const row = new ActionRowBuilder().addComponents(languageSelectMenu);

        await interaction.reply({
            content: `Please select a language to insult ${user}`,
            components: [row],
            ephemeral: true,
        });

        const filter = i => i.customId === 'select-language' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000});

        collector.on('collect', async i => {
            if (i.customId === 'select-language') {
                await i.deferUpdate();
                const lang = i.values[0];
                request(`https://evilinsult.com/generate_insult.php?lang=${lang}`, async (error, response, body) => {
                    if (error) {
                        return i.update({ content: 'An error occurred while fetching the insult.', components: [] });
                    }
                    const insult = body;
                    await interaction.editReply({ content: `The target has been insulted! :)`, components: [] });
                    interaction.channel.send(`${user} ${insult}`);
                });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'You did not select a language in time!', components: [], ephemeral: true });
            }
        });
    },

    name: 'insult',
    description: 'Insults a user!',
    // devOnly: Boolean,
    // deleted: Boolean,
    options: [
        {
            name: 'user',
            description: 'The user you want to insult',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        }
    ],
};
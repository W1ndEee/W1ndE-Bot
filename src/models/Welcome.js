const { Schema, model } = require('mongoose');

const welcomeSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    wchannel: {
        type: String,
        required: true,
    },
    wmessage: {
        type: String,
        requiried: true,
        default: 'Welcome to ${member.guild.name} <@${member.id}>! We now have **${member.guild.memberCount}** members!',
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true,
    },
});

module.exports = model('Welcome', welcomeSchema);
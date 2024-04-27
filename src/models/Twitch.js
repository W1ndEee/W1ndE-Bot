const { Schema, model } = require('mongoose');

const twitchSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    tchannel: {
        type: String,
        required: true,
    },
    schannel: {
        type: String,
        required: true,
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true,
    },
});

module.exports = model('Twitch', twitchSchema);
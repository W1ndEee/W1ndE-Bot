const { Schema, model } = require('mongoose');

const autoroleSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true,
    },
});

module.exports = model('AutoRole', autoroleSchema);
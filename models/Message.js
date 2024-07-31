const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

module.exports = Message;
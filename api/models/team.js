const mongoose = require('mongoose');

const signalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    label: { type: String, required: true }
});

module.exports = mongoose.model('signal', signalSchema);
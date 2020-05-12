const mongoose = require('mongoose');

const signalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    label: { type: String, required: true },
    win: {  type: Number, default: 0 },
    lose: {  type: Number, default: 0 }
});

module.exports = mongoose.model('signal', signalSchema);
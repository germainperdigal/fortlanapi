const mongoose = require('mongoose');

const signalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    game: { type: Date, required: true },
    label: { type: String, required: true },
    team1: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' },
    team2: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' },
    score: { type: Number },
    played: { type: Boolean, required: false, default: false }
});

module.exports = mongoose.model('signal', signalSchema);
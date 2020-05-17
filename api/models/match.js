const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    game: { type: Date, required: true, default: Date.now },
    label: { type: String, required: true },
    team1: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' },
    team2: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' },
    score: { type: Number },
    win: {  type: Number, default: 100, required: true },
    played: { type: Boolean, required: false, default: false },
    winner: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' },
});

module.exports = mongoose.model('match', matchSchema);
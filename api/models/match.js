const mongoose = require('mongoose');

const signalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    label: { type: String, required: true },
    date: {  type: Date, required: true },
    play: {  type: Boolean, default: false },
    team1: {  type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' },
    team2: {  type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' },
    score1: {  type: Number, required: false },
    score2: {  type: Number, required: false },
    winner: {  type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' }
});

module.exports = mongoose.model('signal', signalSchema);
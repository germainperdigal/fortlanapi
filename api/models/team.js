const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    win: {  type: Number, required: false, default: 0 },
    lose: {  type: Number, required: false, default: 0 },
    label: { type: String, required: true }
});

module.exports = mongoose.model('team', teamSchema);
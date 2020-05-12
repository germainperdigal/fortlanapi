const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    isBan: {  type: Boolean, required: false, default: false },
    team: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'team' },
});

module.exports = mongoose.model('user', userSchema);
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils');
const https = require('https');

const user = require("../models/user");
const team = require("../models/team");

router.post("/", (req, res, next) => {
    if (req.headers['authorization'] == "0051d02e0ff305df8894456542f9c2e9f2011d7b81d7fe2a88440b0244adcb7e") {
        const newPromo = new promo({
                _id: new mongoose.Types.ObjectId(),
                label: req.body.label,
            })
            .save()
            .then(result => {
                res.json(result).status(200);
            });
    }
});

router.get("/", (req, res, next) => {
    team.find().exec()
        .then(tTeam => {
            user.find({ team: tTeam._id }).exec().then(tUsers => {
                res.json({ team: tTeam, users: tUsers }).status(200);
            });
        });
});

router.get("/:id", (req, res, next) => {

});


module.exports = router;
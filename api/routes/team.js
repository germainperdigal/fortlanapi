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
        const newTeam = new team({
                _id: new mongoose.Types.ObjectId(),
                label: req.body.label,
            })
            .save()
            .then(result => {
                res.json(newTeam).status(200);
            });
    }
});

router.get("/", (req, res, next) => {
    if (req.headers['authorization'] == "0051d02e0ff305df8894456542f9c2e9f2011d7b81d7fe2a88440b0244adcb7e") {
        promo.find().exec()
            .then(result => {
                res.json(result).status(200);
            });
    }
});


module.exports = router;
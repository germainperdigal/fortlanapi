const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils');
const https = require('https');

const user = require("../models/user");
const team = require("../models/team");
const match = require("../models/match");

router.post("/", (req, res, next) => {

});

router.get("/", (req, res, next) => {
    if (req.headers['authorization'] == "0051d02e0ff305df8894456542f9c2e9f2011d7b81d7fe2a88440b0244adcb7e") {
        match.find().exec()
            .then(result => {
                res.json(result).status(200);
            });
    }
});


module.exports = router;
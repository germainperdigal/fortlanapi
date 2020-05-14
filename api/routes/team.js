const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils');
const https = require('https');

const user = require("../models/user");
const team = require("../models/team");

router.post("/", (req, res, next) => {
    if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
        const newTeam = new team({
                _id: new mongoose.Types.ObjectId(),
                label: req.body.label,
            })
            .save()
            .then(result => {
                res.json(newTeam).status(200);
            });
    } else {
        req.json({  message: "Merci de vous connecter !" }).status(401);
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
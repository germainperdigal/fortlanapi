const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils');
const https = require('https');

const user = require("../models/user");
const team = require("../models/team");

router.post("/", (req, res, next) => {
    if (jwtUtils.getUserId(req.headers['authorization']) != -1) {
        const newTeam = new team({
                _id: new mongoose.Types.ObjectId(),
                label: req.body.label,
            })
            .save()
            .then(result => {
                user.findOneAndUpdate({ _id: jwtUtils.getUserId(req.headers['authorization']) }, { $set: { "team": result._id } }).exec().then(resultat => {
                    res.json(newTeam).status(200);
                })
            });
    } else {
        res.json({  message: "Merci de vous connecter !" }).status(401);
    }
});

router.patch("/join", (req, res, next) => {
    if (jwtUtils.getUserId(req.headers['authorization']) != -1) {
        user.findOneAndUpdate({ _id: jwtUtils.getUserId(req.headers['authorization']) }, { $set: { "team": req.body.team } }).exec().then(resultat => {
            res.json(resultat).status(200);
        });
    } else {
        res.json({  message: "Merci de vous connecter !" }).status(401);
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
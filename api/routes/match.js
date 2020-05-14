const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils');
const https = require('https');

const user = require("../models/user");
const team = require("../models/team");
const match = require("../models/team");

router.post("/", (req, res, next) => {
    if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
        const newMatch = new match({
            _id: new mongoose.Types.ObjectId(),
            label: req.body.label,
            game: req.body.game
        })
        newMatch
            .save()
            .then(result => {
                res.json(result).status(200);
            });
    } else {
        req.json({  message: "Merci de vous connecter !" }).status(401);
    }
});

router.patch("/:id", (req, res, next) => { // Route to enter a match
    if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
        match.findOne({ _id: req.params.id }).exec().then(tMatch => {
            if (!tMatch.team1) {
                match.updateOne({ _id: req.params.id }, { $set: { "team1": jwtUtils.getUserTeam(req.headers['authorization']) } }).exec().then(upMatch => {
                    req.json(upMatch).status(200);
                });
            } else if (tMatch.team1 && !tMatch.team2) {
                match.updateOne({ _id: req.params.id }, { $set: { "team2": jwtUtils.getUserTeam(req.headers['authorization']) } }).exec().then(upMatch => {
                    req.json(upMatch).status(200);
                });
            }
        });
    } else {
        req.json({  message: "Merci de vous connecter !" }).status(401);
    }
});

router.patch("/score/:id", (req, res, next) => { // Route to set score
    if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
        match.findOne({ _id: req.params.id }).exec().then(tMatch => {
            if (!tMatch.score) {
                match.updateOne({ _id: req.params.id }, { $set: { "score": req.body.score, "played": true } }).exec().then(upMatch => {
                    req.json(upMatch).status(200);
                });
            } else {
                req.json({  message: "Le score a déjà été renseigné ! " }).status(401);
            }
        });
    }
});

router.get("/", (req, res, next) => {
    if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
        match.find().exec()
            .then(result => {
                res.json(result).status(200);
            });
    } else {
        req.json({  message: "Merci de vous connecter !" }).status(401);
    }
});


module.exports = router;
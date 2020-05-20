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
    //if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
    const newMatch = new match({
        _id: new mongoose.Types.ObjectId(),
        label: req.body.label,
        game: req.body.game,
        win: req.body.cashprize
    })
    newMatch
        .save()
        .then(result => {
            res.json(result).status(200);
        });
    /*  } else {
          res.json({  message: "Merci de vous connecter !" }).status(401);
      } */
});

router.get("/check/:match", (req, res, next) => {
    if (jwtUtils.getUserId(req.headers['authorization']) != -1) {
        match.findOne({ _id: req.params.match }).exec().then(check => {
            user.findOne({ _id: jwtUtils.getUserId(req.headers['authorization']) }).exec().then(tUser => {
                if (check.team1 == tUser.team ||  check.team2 == tUser.team) {
                    res.json(true).status(200)
                } else {
                    res.json(false).status(200);
                }
            });
        })
    }
});

router.patch("/:id", (req, res, next) => { // Route to enter a match
    if (jwtUtils.getUserId(req.headers['authorization']) != -1) {
        match.findOne({ _id: req.params.id }).exec().then(tMatch => {
            if (!tMatch.team1) {
                user.findOne({ _id: jwtUtils.getUserId(req.headers['authorization']) }).exec().then(tUser => {
                    match.updateOne({ _id: req.params.id }, { $set: { "team1": tUser.team } }).exec().then(upMatch => {
                        res.json(upMatch).status(200);
                    });
                });
            } else if (tMatch.team1 && !tMatch.team2) {
                if (tMatch.team1 != jwtUtils.getUserTeam(req.headers['authorization'])) {
                    user.findOne({ _id: jwtUtils.getUserId(req.headers['authorization']) }).exec().then(tUser => {
                        match.updateOne({ _id: req.params.id }, { $set: { "team2": tUser.team } }).exec().then(upMatch => {
                            res.json(upMatch).status(200);
                        });
                    });
                } else {
                    res.json({  message: "Déjà inscrit à ce tournoi..." }).status(401);
                }
            }
        });
    } else {
        res.json({  message: "Merci de vous connecter !" }).status(401);
    }
});

router.patch("/winner/:id", (req, res, next) => { // Route to set score
    match.findOne({ _id: req.params.id }).exec().then(tMatch => {
        if (!tMatch.winner) {
            match.updateOne({ _id: req.params.id }, { $set: { "winner": req.body.winner, "played": true } }).exec().then(upMatch => {
                if (tMatch.team1 == req.body.winner) {
                    team.updateOne({  _id: tMatch.team1 }, { $inc: { "win": 1 } }).exec();
                    team.updateOne({  _id: tMatch.team2 }, { $inc: { "lose": 1 } }).exec();
                } else {
                    team.updateOne({  _id: tMatch.team2 }, { $inc: { "win": 1 } }).exec();
                    team.updateOne({  _id: tMatch.team1 }, { $inc: { "lose": 1 } }).exec();
                }
                res.json(upMatch).status(200);
            });
        } else {
            res.json({  message: "Le gagnant a déjà été renseigné ! " }).status(401);
        }
    });
});

router.get("/", (req, res, next) => {
    if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
        match.find().exec()
            .then(result => {
                res.json(result).status(200);
            });
    } else {
        res.json({  message: "Merci de vous connecter !" }).status(401);
    }
});

router.get("/week", (req, res, next) => {
    var start = new Date();
    var date = new Date();
    var end = new Date(date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000)));
    if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
        match.find({
                "game": {
                    "$gte": start,
                    "$lte": end
                }
            }).exec()
            .then(result => {
                res.json(result).status(200);
            });
    } else {
        res.json({  message: "Merci de vous connecter !" }).status(401);
    }
});

router.get("/winners/lastweek", (req, res, next) => {
    var start = new Date();
    var date = new Date();
    var end = new Date(date.setTime(date.getTime() - (7 * 24 * 60 * 60 * 1000)));
    match.find({
            "game": {
                "$gte": end,
                "$lte": start
            }
        }).populate('winner').exec()
        .then(result => {
            res.json(result).status(200);
        })
        .catch(error => {
            res.json(error).status(500);
        })
});

module.exports = router;
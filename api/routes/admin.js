const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils');

const team = require("../models/team");
const match = require("../models/match");
const admin = require("../models/admin");
const user = require("../models/user");

router.post("/create-admin-123", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err.error
            });
        } else {
            const newAdmin = new admin({
                _id: new mongoose.Types.ObjectId(),
                pseudo: req.body.pseudo,
                password: hash,
            });
            newAdmin
                .save()
                .then(result => {});
        }
    });
});

router.post("/login", (req, res, next) => {
    admin.find({ pseudo: req.body.pseudo })
        .exec()
        .then(resUser => {
            if (resUser.length < 1) {
                return res.status(401).json({
                    message: "Impossible de reconnaître vos identifiants..."
                });
            }
            bcrypt.compare(req.body.password, resUser[0].password, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json({
                        message: "Le mot de passe renseigné est invalide.."
                    });
                }
                if (result) {
                    const token = jwtUtils.generateAdminToken(resUser[0], false);
                    return res.status(200).json({
                        message: "Connexion réussie !",
                        userID: resUser[0]._id,
                        token: token
                    });
                }
                console.log(err);
                res.status(500).json({
                    message: "Impossible de vous connecter, merci de ré-essayer.."
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get("/users", (req, res, next) => {
    if (req.headers['authorization'] == "0051d02e0ff305df8894456542f9c2e9f2011d7b81d7fe2a88440b0244adcb7e") {
        user.find().populate('team').exec().then(result => {
            res.json(result).status(200);
        }).catch(err => {
            res.json(err).status(500);
        })
    }
});

router.get("/matches", (req, res, next) => {
    if (req.headers['authorization'] == "0051d02e0ff305df8894456542f9c2e9f2011d7b81d7fe2a88440b0244adcb7e") {
        match.find().sort({ game: -1 }).exec().then(result => {
            res.status(200).json(result);
        })
    }
});


router.get("/match/:id", (req, res, next) => {
    if (req.headers['authorization'] == "0051d02e0ff305df8894456542f9c2e9f2011d7b81d7fe2a88440b0244adcb7e") {
        match.findOne({ _id: req.params.id }).populate('team1')
            .populate('team2').exec().then(result => {
                res.status(200).json(result);
            })
    }
});

router.get("/count/users", (req, res, next) => {
    if (req.headers['authorization'] == "0051d02e0ff305df8894456542f9c2e9f2011d7b81d7fe2a88440b0244adcb7e") {
        user.count().exec().then(count => {
            res.status(200).json(count);
        })
    }
});

router.get("/count/matches", (req, res, next) => {
    if (req.headers['authorization'] == "0051d02e0ff305df8894456542f9c2e9f2011d7b81d7fe2a88440b0244adcb7e") {
        match.count().exec().then(count => {
            res.status(200).json(count);
        })
    }
});


module.exports = router;
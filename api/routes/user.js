const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils');
const https = require('https');

const user = require("../models/user");
const team = require("../models/team");

router.post('/register', (req, res, next) => {
    user.find({ email: req.body.email })
        .exec()
        .then(resUser => {
            if (resUser.length >= 1) {
                return res.status(409).json({
                    message: "Ces informations sont déjà associées à un compte..."
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err.error
                        });
                    } else {
                        const newUser = new user({
                            _id: new mongoose.Types.ObjectId(),
                            email: String(req.body.email).toLowerCase(),
                            password: hash,
                            fname: req.body.fname,
                            lname: req.body.lname
                        });
                        newUser
                            .save()
                            .then(result => {
                                res.status(200).json(result);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

router.post('/login', (req, res, next) => {
    user.find({
            email: String(req.body.email).toLowerCase(),
            isBan: false
        })
        .exec()
        .then(resUser => {
            if (resUser.length < 1) {
                return res.status(401).json({
                    message: "L'adresse e-mail renseignée n'est liée à aucun compte, ou bannie..."
                });
            }
            bcrypt.compare(req.body.password, resUser[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Le mot de passe renseigné est invalide.."
                    });
                }
                if (result) {
                    const token = jwtUtils.generateToken(resUser[0], false);
                    return res.status(200).json({
                        message: "Connexion réussie !",
                        userID: resUser[0]._id,
                        token: token
                    });
                }
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

router.patch('/team', (req, res, next) => {
    if (jwtUtils.getUserTeam(req.headers['authorization']) != -1) {
        user.updateOne({ _id: jwtUtils.getUserTeam(req.headers['authorization']) }, { $set: { "team": req.body.team } }).exec().then(upUser => {
            res.json(upUser).status(200);
        });
    }
});


module.exports = router;
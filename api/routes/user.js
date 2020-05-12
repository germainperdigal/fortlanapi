const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils');
const https = require('https');

const user = require("../models/user");
const team = require("../models/team");

router.post('/unlock', (req, res, next) => {
    master.findOne({  _id: "conf" }).exec().then(resultMaster => {
        res.json(resultMaster.password).status(200);
    })
});

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


module.exports = router;
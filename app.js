const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./api/routes/user');
const teamRoutes = require('./api/routes/team');

mongoose.connect('mongodb://germainProd:GermainP69@fifbet.com:27017/fifbet?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=fifbet&authMechanism=SCRAM-SHA-256', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PATCH, DELETE, GET, PUT');
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

app.use(cors());
app.use('/user', userRoutes);
app.use('/team', teamRoutes);

module.exports = app;
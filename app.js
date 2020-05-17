const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./api/routes/user');
const teamRoutes = require('./api/routes/team');
const matchRoutes = require('./api/routes/match');

mongoose.connect('mongodb+srv://prod:pyh4PjtgoJFGNkqX@cluster0-tykwd.gcp.mongodb.net/test?retryWrites=true&w=majority', {
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
app.use('/match', matchRoutes);

module.exports = app;
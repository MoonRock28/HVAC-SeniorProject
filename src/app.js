'use strict';
const express = require('express');
const app = express();
require('./routes/buildings')(app);
require('./routes/avus')(app);
require('./routes/fans')(app);
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Home = require('./models/homeContent');
const handleHome = require('./handlers/homeHandler');

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});

mongoose.connect('mongodb://localhost/HVAC');

mongoose.connection.on('open', () => {
    console.log('connection to mongoDB has been established...');
    Home.findOneOrCreate({}, {buildings: [], avus: [], fans: []}, (err, record) => {
        console.log('Home Content Found...');
    });
});

mongoose.connection.on('close', () => {
    console.log('connection to mongoDB has been closed...')
});


app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));
// app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', urlEncodedParser, (req, res) => {
    if(req.body.username === 'user' && req.body.password === 'getIn')
        res.redirect('/home');
    else
        res.redirect('/');
});

app.get('/home', (req, res) => {
    // console.log('in the default route. home page');
    handleHome.parseHome((err, info) => {
        res.render('home', info);

    });


});

app.listen(3000);
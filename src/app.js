'use strict';
const express = require('express');
const session = require('express-session');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Home = require('./models/homeContent');
const handleHome = require('./handlers/homeHandler');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});

mongoose.connect('mongodb://localhost/HVAC');

mongoose.connection.on('open', () => {
    console.log('connection to mongoDB has been established...');
    Home.findOneOrCreate({}, {buildings: [], FSs: [], fans: [], colorCheckDate: new Date()}, (err, record) => {
        console.log('Home Content Found...');
    });
});

mongoose.connection.on('close', () => {
    console.log('connection to mongoDB has been closed...')
});


app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));
app.use(session({
    secret: 'templeRexburg',
    resave: false,
    saveUninitialized: true
}));
require('./routes/buildings')(app);
require('./routes/fs')(app);
require('./routes/fans')(app);
// app.use(express.static(path.join(__dirname, 'assets')));

let sess;

app.get('/invalid', (req, res) => {
    res.render('invalid');
});

app.get('/', (req, res) => {
    handleHome.dailyColorUpdate( (err, successful) => {
        res.render('login');
    });
//    res.render('login');
});

app.post('/login', urlEncodedParser, (req, res) => {
    sess = req.session;
    sess.cookie.maxAge = 14400000; // set cookie for 4 hours.
    if(req.body.username === 'admin' && req.body.password === 'getIn') {
        sess.user = 'admin';
        res.redirect('/home');
    }
    else if (req.body.username === 'student' && req.body.password === 'byuhvac'){
        sess.user = 'student';
        res.redirect('/home');
    }
    else
        res.redirect('/invalid');
});

app.get('/home', (req, res) => {
    // console.log('in the default route. home page');
    sess = req.session;
    handleHome.parseHome((err, info) => {
        // console.log(JSON.stringify(info, null, 2));
        if (sess.user === 'admin')
            res.render('home', info);
        else if (sess.user === 'student')
            res.render('shome', info);
        else
            res.redirect('/invalid');

    });
});

app.get('/logout', (req, res) => {
    sess = req.session;
    sess.cookie.maxAge = 1000;
    res.redirect('/');
});

app.listen(3000);
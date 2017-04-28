'use strict';
const express = require('express');
const app = express();
require('./routes/buildings')(app);
require('./routes/avus')(app);
require('./routes/fans')(app);
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));
// app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {

});

app.get('/home', (req, res) => {
   // console.log('in the default route. home page');
   res.render('home');
});













app.listen(3000);
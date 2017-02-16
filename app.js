var express = require('express');
var app = express();

// app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', function (req, res) {
   // console.log('in the default route. home page');
   res.send('this is the home page');
});

app.get('/building', function (req, res) {
    // console.log('in the default route.');
    res.send('this is the building page');
});

app.get('/createBuilding', function (req, res) {
    res.send('this is the createBuilding page');
});

app.post('/editBuilding', function (req, res) {
    console.log('this is the editBuilding route that reroutes to /building');
    res.send('rerouting to /building');
});

app.get('/avu', function (req, res) {
    res.send('this is the avu page');
});

app.get('/createAvu', function (req, res) {
    res.send('this is the createAvu page');
});

app.post('/editAvu', function (req, res) {
    console.log('this is the editAvu route that reroutes to /avu');
    res.send('rerouting to /avu');
});

app.get('/fan', function (req, res) {
    res.send('this is the fan page');
});

app.get('/createFan', function (req, res) {
    res.send('this is the createFan page');
});

app.get('/editFan', function (req, res) {
    console.log('this is the editFan route that reroutes to /fan');
    res.send('rerouting to /fan');
});

app.listen(3000);
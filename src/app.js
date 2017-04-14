const express = require('express');
const app = express();

// app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
   // console.log('in the default route. home page');
   res.send('this is the home page');
});

app.get('/building', (req, res) => {
    // console.log('in the default route.');
    res.send('this is the building page');
});

app.get('/createBuilding', (req, res) => {
    res.send('this is the createBuilding page');
});

app.post('/editBuilding', (req, res) => {
    console.log('this is the editBuilding route that reroutes to /building');
    res.send('rerouting to /building');
});

app.get('/avu', (req, res) => {
    res.send('this is the avu page');
});

app.get('/createAvu', (req, res) => {
    res.send('this is the createAvu page');
});

app.post('/editAvu', (req, res) => {
    console.log('this is the editAvu route that reroutes to /avu');
    res.send('rerouting to /avu');
});

app.get('/fan', (req, res) => {
    res.send('this is the fan page');
});

app.get('/createFan', (req, res) => {
    res.send('this is the createFan page');
});

app.get('/editFan', (req, res) => {
    console.log('this is the editFan route that reroutes to /fan');
    res.send('rerouting to /fan');
});

app.listen(3000);
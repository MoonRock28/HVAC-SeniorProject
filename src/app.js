const express = require('express');
const app = express();

app.set('view engine', 'ejs');

// app.use('/assets', express.static('assets'));
// app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
   // console.log('in the default route. home page');
   res.render('home'/*, {homeContent}*/);
});

app.get('/building/:id', (req, res) => {
    // console.log('in the default route.');
    res.render('building' /*, {buildingContent} */);
});

app.get('/createBuilding', (req, res) => {
    res.render('newDocument'/*, {docType = building} */);
});

app.post('/saveBuilding', (req, res) => {
    res.render('building'/*, {}*/);
});

app.post('/editBuilding/:id', (req, res) => {
    console.log('this is the editBuilding route that reroutes to /building');
    res.render('building'/*, {buildingContent} */);
});

app.get('/avu/:id', (req, res) => {
    res.render('avu'/*, {avuContent}*/);
});

app.get('/createAvu', (req, res) => {
    res.render('newDocument'/*, {docType = avu}*/);
});

app.post('/editAvu/:id', (req, res) => {
    console.log('this is the editAvu route that reroutes to /avu');
    res.render('avu'/*, {avuContent} */);
});

app.get('/fan/:id', (req, res) => {
    res.render('fan'/*, {fanContent}*/);
});

app.get('/createFan', (req, res) => {
    res.render('newDocument'/*, {docType = fan} */);
});

app.get('/editFan/:id', (req, res) => {
    console.log('this is the editFan route that reroutes to /fan');
    res.render('fan'/*, {fanContent}*/);
});

app.listen(3000);
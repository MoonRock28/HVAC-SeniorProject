'use strict';
const handleFan = require('../handlers/fanHandler');
const handleBelt = require('../handlers/beltHandler');
const handleBuilding = require('../handlers/buildingHandler');
const serveFan = require('../services/serveFan');
const serveBelt = require('../services/serveBelt');


module.exports = (app) => {
    app.get('/fan/', (req, res) => {

        res.render('fan'/*, {fanContent}*/);
    });

    app.get('/createFan', (req, res) => {
        res.render('newDocument'/*, {docType = fan} */);
    });

    app.post('/saveFan', (req, res) => {

    });

    app.post('/editFan/:id', (req, res) => {
        console.log('this is the editFan route that reroutes to /fan');
        res.render('fan'/*, {fanContent}*/);
    });
};
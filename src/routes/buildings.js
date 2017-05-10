'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const Building = require('../handlers/buildingHandler');
const serveBuilding = require('../services/serveBuilding');

module.exports = (app) => {

    app.get('/building', (req, res) => {
        console.log(req.query.id);
        serveBuilding.getBuilding(req.query.id, (err, record) => {
            res.render('building', record);
        });
    });

    app.get('/createBuilding', (req, res) => {
        res.render('newBuilding');
    });

    app.post('/saveBuilding', urlEncodedParser,(req, res) => {
        console.log(req.body);
        Building.saveBuilding(req.body, (err, objectId) => {
            res.redirect('/building?id=' + objectId.toString());
        });
    });

    app.post('/editBuilding/:id', (req, res) => {
        console.log('this is the editBuilding route that reroutes to /building');
        res.render('building'/*, {buildingContent} */);
    });
};
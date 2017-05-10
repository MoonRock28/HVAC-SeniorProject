'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const avuHandler = require('../handlers/avuHandler');
const avuService = require('../services/serveAvu');

module.exports = (app) => {
    app.get('/avu', (req, res) => {
        avuService.getAVU(req.query.id, (err, record) => {
            res.render('avu', record);
        });
    });

    app.get('/createAvu', (req, res) => {
        console.log(req.query.id);
        console.log(req.query.buildingName);

        res.render('newAvu', {id: req.query.id, buildingName: req.query.buildingName, });
    });

    app.post('/saveAvu', urlEncodedParser, (req, res) => {
        console.log(req.body);
        avuHandler.saveAVU(req.body, (err, objectId) => {
            res.redirect('/avu?id=' + objectId);
        });
    });

    app.post('/editAvu/:id', (req, res) => {
        console.log('this is the editAvu route that reroutes to /avu');
        res.render('avu'/*, {avuContent} */);
    });
};
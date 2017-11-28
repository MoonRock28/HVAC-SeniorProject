'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const Building = require('../handlers/buildingHandler');
const handleHome = require('../handlers/homeHandler');
// const serveBuilding = require('../services/serveBuilding');

module.exports = (app) => {

    app.get('/building', (req, res) => {
        // console.log(req.query.id);

        Building.getBuildingInfo(req.query.id, (err, info) => {
            if (err) console.error(err);
            res.render('building', info);
        });
    });

    app.get('/createBuilding', (req, res) => {
        res.render('newBuilding');
    });

    app.post('/saveBuilding', urlEncodedParser,(req, res) => {
        // console.log(req.body);
        Building.saveBuilding(req.body, (err, objectId) => {
            res.redirect(`/building?id=${objectId.toString()}`);
        });
    });

    app.get('/editBuilding', urlEncodedParser, (req, res) => {
        Building.getBuildingInfo(req.query.buildingId, (err, info) => {
            //console.log(JSON.stringify(info, null, 4));
            res.render('editBuilding', info);
        });
    });

    app.post('/updateBuilding', urlEncodedParser, (req, res) => {
        Building.editBuilding(req.body, (err, objectId) => {
            res.redirect('/building?id=' + objectId.toString());
        });
    });

    app.get('/removeBuilding', (req, res) => {
        Building.removeBuilding(req.query.buildingId, (err) => {
            if (err) console.error("Error in removing building...\n" + err);
            handleHome.removeBuildingFromList(req.query.buildingId, (err) => {
                if (err) console.error("Error in removing building from homeContent...\n" + err);
                res.redirect('/home');
            });
        });
    });
};
'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const avuHandler = require('../handlers/avuHandler');
const handleBuilding = require('../handlers/buildingHandler');
const filterHandler = require('../handlers/filterHandler');
const avuService = require('../services/serveAvu');

module.exports = (app) => {
    app.get('/avu', (req, res) => {
        avuHandler.getAvuInfo(req.query.id, (err, record) => {
            // console.log(record);
            res.render('avu', {avu: record, building: {name: req.query.buildingName, id: req.query.buildingId}});
        });
    });

    app.get('/createAvu', (req, res) => {
        console.log(req.query.id);
        console.log(req.query.buildingName);

        res.render('newAvu', {id: req.query.id, buildingName: req.query.buildingName, });
    });

    app.get('/deleteAvu', (req, res) => {
        // console.log(req.query.id);
        avuHandler.deleteAVU(req.query.avuId, (err, result) => {
            if (err) console.err("Error in deleteAvu...\n" + err);
            handleBuilding.removeAvuFromList(req.query.buildingId, req.query.avuId, (err, result) => {
                if (err) console.err("Error in removing AVU from building list...\n" + err);
                console.log(`AVU Deleted...\n`);
                res.redirect(`/building?id=${req.query.buildingId}`);
            });

        });
    });

    app.post('/saveAvu', urlEncodedParser, (req, res) => {
        console.log(req.body);
        avuHandler.saveAVU(req.body, (err, info) => {
            handleBuilding.updateColorNums(info.building.id, (err, result) => {
                res.redirect(`/avu?id=${info.id}&buildingName=${info.building.name}&buildingId=${info.building.id}`);
            });
        });
    });

    app.post('/editAvu/:id', (req, res) => {
        console.log('this is the editAvu route that reroutes to /avu');
        res.render('avu'/*, {avuContent} */);
    });

    app.post('/addFilter', urlEncodedParser, (req, res) => {
        filterHandler.addFilter(req.body, req.body.id, (err, avuId) => {
            res.redirect(`/avu?id=${avuId}&buildingName=${req.body.buildingName}&buildingId=${req.body.buildingId}`);
        });
    });

    app.get('/removeFilter', (req, res) => {
        filterHandler.removeFilter(req.query.filterId, req.query.avuId, () => {
            res.redirect(`/avu?id=${req.query.avuId}&buildingName=${req.query.buildingName}&buildingId=${req.query.buildingId}`);
        });
    });
};
'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const avuHandler = require('../handlers/avuHandler');
const handleBuilding = require('../handlers/buildingHandler');
const filterHandler = require('../handlers/filterHandler');
const handleHome = require('../handlers/homeHandler');
const avuService = require('../services/serveAvu');

module.exports = (app) => {
    app.get('/avu', (req, res) => {
        avuHandler.getAvuInfo(req.query.id, (err, record) => {
            // console.log(record);
            res.render('avu', record);
        });
    });

    app.get('/createAvu', (req, res) => {
        console.log(req.query.buildingId);
        console.log(req.query.buildingName);
        handleBuilding.getBuildingInfo(req.query.buildingId, (err, building) => {
            console.log(JSON.stringify(building, null, 4));
            res.render('newAvu', building);
        });

    });

    app.get('/deleteAvu', (req, res) => {
        // console.log(req.query.id);
        avuHandler.deleteAVU(req.query.avuId, (err, result) => {
            if (err) console.error("Error in deleteAvu...\n" + err);
            handleBuilding.removeAvuFromList(req.query.buildingId, req.query.avuId, (err, result) => {
                if (err) console.error("Error in removing AVU from building list...\n" + err);
                handleHome.removeAvuFromList(req.query.avuId, (err, results) => {
                    if (err) console.error("Error in removing AVU from Home list...\n" + err);
                    console.log(`Fan Deleted...\n`);
                    res.redirect(`/building?id=${req.query.buildingId}`);
                });
                console.log(`AVU Deleted...\n`);
                res.redirect(`/building?id=${req.query.buildingId}`);
            });
        });
    });

    app.post('/saveAvu', urlEncodedParser, (req, res) => {
        //console.log(req.body);
        avuHandler.saveAVU(req.body, (err, info) => {
            handleBuilding.updateColorNums(info.building.id, (err, result) => {
                res.redirect(`/avu?id=${info.id}`);
            });
        });
    });

    app.post('/updateAvu', urlEncodedParser, (req, res) => {
        // console.log(req.body);
        avuHandler.quickUpdate(req.body.nextDateToCheck, req.body.avuId, (err) => {
            if (err) console.error('Error in avu quickUpdate...\n' + err);
            res.redirect(`/avu?id=${req.body.avuId}`);
        });
    });

    app.post('/editAvu/:id', (req, res) => {
        console.log('this is the editAvu route that reroutes to /avu');
        res.render('avu'/*, {avuContent} */);
    });

    app.post('/addFilter', urlEncodedParser, (req, res) => {
        filterHandler.addFilter(req.body, req.body.id, (err, avuId) => {
            res.redirect(`/avu?id=${avuId}`);
        });
    });

    app.get('/removeFilter', (req, res) => {
        filterHandler.removeFilter(req.query.filterId, req.query.avuId, () => {
            res.redirect(`/avu?id=${req.query.avuId}`);
        });
    });
};
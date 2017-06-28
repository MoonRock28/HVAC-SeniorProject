'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const handleFan = require('../handlers/fanHandler');
const handleBelt = require('../handlers/beltHandler');
const handleBuilding = require('../handlers/buildingHandler');
const handleHome = require('../handlers/homeHandler');
const serveFan = require('../services/serveFan');
const serveBelt = require('../services/serveBelt');


module.exports = (app) => {
    app.get('/fan/', (req, res) => {
        handleFan.getFanInfo(req.query.id, (err, record) => {
            if (err) console.error("Error getting Fan info...\n" + err);
            res.render('fan', record);
        });
    });

    app.get('/createFan', urlEncodedParser, (req, res) => {
        handleBuilding.getBuildingInfo(req.query.buildingId, (err, building) => {
            console.log(JSON.stringify(building, null, 4));
            res.render('newFan', building);

        });
    });

    app.post('/saveFan', urlEncodedParser, (req, res) => {
        handleFan.saveFan(req.body, (err, info) => {
            handleBuilding.updateColorNums(info.building.id, (err, result) => {
                res.redirect(`/fan?id=${info.id}`);
            });
        });
    });

    app.get('/editFan', (req, res) => {
        // console.log(req.body);
        handleFan.getFanInfo(req.query.fanId, (err, fanInfo) => {
            // console.log(JSON.stringify(fanInfo, null, 2));
            res.render('editFan', fanInfo);
        });
    });

    app.post('/updateFan', urlEncodedParser, (req, res) => {
        handleFan.updateFan(req.body, (err, objectId) => {
            res.redirect('/fan?id=' + objectId);
        });
    });

    app.post('/quickUpdateFan', urlEncodedParser, (req, res) => {
        // console.log(req.body);
        handleFan.quickUpdate(req.body.nextDateToCheck, req.body.fanId, (err) => {
            if (err) console.error('Error in fan quickUpdate...\n' + err);
            res.redirect(`/fan?id=${req.body.fanId}`);
        });
    });

    app.get('/deleteFan', (req, res) => {
        // console.log(req.query.id);
        handleFan.deleteFan(req.query.fanId, (err, result) => {
            if (err) console.error("Error in deleteFan...\n" + err);
            handleBuilding.removeFanFromList(req.query.buildingId, req.query.fanId, (err, result) => {
                if (err) console.error("Error in removing Fan from building list...\n" + err);
                handleHome.removeFanFromList(req.query.fanId, (err, results) => {
                    if (err) console.error("Error in removing Fan from Home list...\n" + err);
                    console.log(`Fan Deleted...\n`);
                    res.redirect(`/building?id=${req.query.buildingId}`);
                });
            });
        });
    });

    app.post('/addBelt', urlEncodedParser, (req, res) => {
        handleBelt.addBelt(req.body, req.body.id, (err, fanId) => {
            res.redirect(`/fan?id=${fanId}`);
        });
    });

    app.get('/removeBelt', (req, res) => {
        handleBelt.removeBelt(req.query.beltId, req.query.fanId, () => {
            res.redirect(`/fan?id=${req.query.fanId}`);
        });
    });
};
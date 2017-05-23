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
        res.render('newFan', {buildingId: req.query.buildingId, buildingName: req.query.buildingName});
    });

    app.post('/saveFan', urlEncodedParser, (req, res) => {
        handleFan.saveFan(req.body, (err, info) => {
            handleBuilding.updateColorNums(info.building.id, (err, result) => {
                res.redirect(`/fan?id=${info.id}`);
            });
        });
    });

    app.post('/editFan/:id', (req, res) => {
        console.log('this is the editFan route that reroutes to /fan');
        res.render('fan'/*, {fanContent}*/);
    });

    app.post('/updateFan', urlEncodedParser, (req, res) => {
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
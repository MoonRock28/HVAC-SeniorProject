'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const handleFan = require('../handlers/fanHandler');
const handleBelt = require('../handlers/beltHandler');
const handleBuilding = require('../handlers/buildingHandler');
const handleHome = require('../handlers/homeHandler');
// const serveFan = require('../services/serveFan');
// const serveBelt = require('../services/serveBelt');


module.exports = (app) => {
    let sess;
    app.get('/fan/', (req, res) => {
        sess = req.session;
        handleFan.getFanInfo(req.query.id, (err, record) => {
            if (err) console.error("Error getting Fan info...\n" + err);
            if (sess.user === 'admin')
                res.render('fan', record);
            else if (sess.user === 'student')
                res.render('sfan', record);
            else
                res.redirect('/invalid');
        });
    });

    app.get('/createFan', urlEncodedParser, (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        handleBuilding.getBuildingInfo(req.query.buildingId, (err, building) => {
            console.log(JSON.stringify(building, null, 4));
            res.render('newFan', building);

        });
    });

    app.post('/saveFan', urlEncodedParser, (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        handleFan.saveFan(req.body, (err, info) => {
            handleBuilding.updateColorNums(info.building.id, (err, result) => {
                res.redirect(`/fan?id=${info.id}`);
            });
        });
    });

    app.get('/editFan', (req, res) => {
        // console.log(req.body);
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        handleFan.getFanInfo(req.query.fanId, (err, fanInfo) => {
            // console.log(JSON.stringify(fanInfo, null, 2));
            res.render('editFan', fanInfo);
        });
    });

    app.post('/updateFan', urlEncodedParser, (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        handleFan.updateFan(req.body, (err, objectId) => {
            res.redirect('/fan?id=' + objectId);
        });
    });

    app.post('/quickUpdateFan', urlEncodedParser, (req, res) => {
        // console.log(req.body);
        sess = req.session;
        if (sess.user === 'admin' || sess.user === 'student')
            handleFan.quickUpdate(req.body.nextDateToCheck, req.body.fanId, (err) => {
                if (err) console.error('Error in fan quickUpdate...\n' + err);
                res.redirect(`/fan?id=${req.body.fanId}`);
            });
        else
            res.redirect('/invalid');
    });

    app.get('/deleteFan', (req, res) => {
        // console.log(req.query.id);
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
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
        sess = req.session;
        if (sess.user === 'admin' || sess.user === 'student')
            handleBelt.addBelt(req.body, req.body.id, (err, fanId) => {
                res.redirect(`/fan?id=${fanId}`);
            });
        else
            res.redirect('/invalid');
    });

    app.get('/removeBelt', (req, res) => {
        sess = req.session;
        if (sess.user === 'admin' || sess.user === 'student')
            handleBelt.removeBelt(req.query.beltId, req.query.fanId, () => {
                res.redirect(`/fan?id=${req.query.fanId}`);
            });
        else
            res.redirect('/invalid');
    });
};
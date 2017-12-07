'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const Building = require('../handlers/buildingHandler');
const handleHome = require('../handlers/homeHandler');
// const serveBuilding = require('../services/serveBuilding');

module.exports = (app) => {
    let sess;

    app.get('/building', (req, res) => {
        // console.log(req.query.id);
        sess = req.session;

        Building.getBuildingInfo(req.query.id, (err, info) => {
            if (err) console.error(err);
            if (sess.user === 'admin')
                res.render('building', info);
            else if (sess.user === 'student')
                res.render('sbuilding', info);
            else
                res.redirect('/invalid');
        });
    });

    app.get('/createBuilding', (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        res.render('newBuilding');
    });

    app.post('/saveBuilding', urlEncodedParser,(req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        Building.saveBuilding(req.body, (err, objectId) => {
            res.redirect(`/building?id=${objectId.toString()}`);
        });
    });

    app.get('/editBuilding', urlEncodedParser, (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        Building.getBuildingInfo(req.query.buildingId, (err, info) => {
            //console.log(JSON.stringify(info, null, 4));
            res.render('editBuilding', info);
        });
    });

    app.post('/updateBuilding', urlEncodedParser, (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        Building.editBuilding(req.body, (err, objectId) => {
            res.redirect('/building?id=' + objectId.toString());
        });
    });

    app.get('/removeBuilding', (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        console.log("about to call building.removeBuilding()");
        Building.removeBuilding(req.query.buildingId, (err) => {
            if (err) console.error("Error in removing building...\n" + err);
            console.log("about to call handleHome.removeBuildingFromList()");
            handleHome.removeBuildingFromList(req.query.buildingId, (err) => {
                if (err) console.error("Error in removing building from homeContent...\n" + err);
                console.log("about to redirect to home page.");
                res.redirect('/home');
            });
        });
    });
};
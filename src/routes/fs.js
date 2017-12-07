'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const FSHandler = require('../handlers/FSHandler');
const handleBuilding = require('../handlers/buildingHandler');
const filterHandler = require('../handlers/filterHandler');
const handleHome = require('../handlers/homeHandler');
const avuService = require('../services/serveFS');

module.exports = (app) => {
    let sess;
    app.get('/FS', (req, res) => {
        sess = req.session;
        FSHandler.getFsInfo(req.query.id, (err, record) => {
            // console.log(record);
            if (sess.user === 'admin')
                res.render('fs', record);
            else if (sess.user === 'student')
                res.render('sfs', record);
            else
                res.redirect('/invalid');
        });
    });

    app.get('/createFS', (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        console.log(req.query.buildingId);
        console.log(req.query.buildingName);
        handleBuilding.getBuildingInfo(req.query.buildingId, (err, building) => {
            //console.log(JSON.stringify(building, null, 4));
            res.render('newFS', building);
        });

    });

    app.get('/deleteFS', (req, res) => {
        // console.log(req.query.id);
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        FSHandler.deleteFS(req.query.FSId, (err, result) => {
            if (err) console.error("Error in deleteFS...\n" + err);
            handleBuilding.removeFSFromList(req.query.buildingId, req.query.FSId, (err, result) => {
                if (err) console.error("Error in removing Filtration System from building list...\n" + err);
                handleHome.removeFSFromList(req.query.FSId, (err, results) => {
                    if (err) console.error("Error in removing Filtration System from Home list...\n" + err);
                    console.log(`Filtration System Deleted...\n`);
                    res.redirect(`/building?id=${req.query.buildingId}`);
                });
            });
        });
    });

    app.post('/saveFS', urlEncodedParser, (req, res) => {
        //console.log(req.body);
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        FSHandler.saveFS(req.body, (err, info) => {
            handleBuilding.updateColorNums(info.building.id, (err, result) => {
                res.redirect(`/FS?id=${info.id}`);
            });
        });
    });

    app.post('/quickUpdateFS', urlEncodedParser, (req, res) => {
        // console.log(req.body);
        sess = req.session;
        if (sess.user === 'admin' || sess.user === 'student')
            FSHandler.quickUpdate(req.body.nextDateToCheck, req.body.FSId, (err) => {
                if (err) console.error('Error in avu quickUpdate...\n' + err);
                handleBuilding.updateColorNums(req.body.buildingId, (err) => {
                    res.redirect(`/FS?id=${req.body.FSId}`);
                });
            });
        else
            res.redirect('/invalid');
    });

    app.post('/updateFS', urlEncodedParser, (req, res) => {
        //console.log(req.body);
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        FSHandler.updateFs(req.body, (err, objectId) => {
            res.redirect('/FS?id=' + objectId);
        });
    });

    app.get('/editFS', (req, res) => {
        sess = req.session;
        if (sess.user !== 'admin')
            res.redirect('/invalid');
        FSHandler.getFsInfo(req.query.FSId, (err, FSInfo) => {
            //console.log(JSON.stringify(FSInfo, null, 2));
            res.render('editFS', FSInfo);
        });
    });

    app.post('/addFilter', urlEncodedParser, (req, res) => {
        sess = req.session;
        if (sess.user === 'admin' || sess.user === 'student')
            filterHandler.addFilter(req.body, req.body.id, (err, FSId) => {
                res.redirect(`/FS?id=${FSId}`);
            });
        else
            res.redirect('/invalid');
    });

    app.get('/removeFilter', (req, res) => {
        sess = req.session;
        if (sess.user === 'admin' || sess.user === 'student')
            filterHandler.removeFilter(req.query.filterId, req.query.FSId, () => {
                res.redirect(`/FS?id=${req.query.FSId}`);
            });
        else
            res.redirect('/invalid');
    });
};
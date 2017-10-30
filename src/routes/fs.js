'use strict';
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false});
const FSHandler = require('../handlers/FSHandler');
const handleBuilding = require('../handlers/buildingHandler');
const filterHandler = require('../handlers/filterHandler');
const handleHome = require('../handlers/homeHandler');
const avuService = require('../services/serveFS');

module.exports = (app) => {
    app.get('/FS', (req, res) => {
        FSHandler.getFsInfo(req.query.id, (err, record) => {
            // console.log(record);
            res.render('fs', record);
        });
    });

    app.get('/createFS', (req, res) => {
        console.log(req.query.buildingId);
        console.log(req.query.buildingName);
        handleBuilding.getBuildingInfo(req.query.buildingId, (err, building) => {
            console.log(JSON.stringify(building, null, 4));
            res.render('newFS', building);
        });

    });

    app.get('/deleteFS', (req, res) => {
        // console.log(req.query.id);
        FSHandler.deleteFS(req.query.FSId, (err, result) => {
            if (err) console.error("Error in deleteFS...\n" + err);
            handleBuilding.removeFSFromList(req.query.buildingId, req.query.FSId, (err, result) => {
                if (err) console.error("Error in removing Filtration System from building list...\n" + err);
                handleHome.removeFSFromList(req.query.FSId, (err, results) => {
                    if (err) console.error("Error in removing Filtration System from Home list...\n" + err);
                    console.log(`Filtration System Deleted...\n`);
                    res.redirect(`/building?id=${req.query.buildingId}`);
                });
                console.log(`Filtration System Deleted...\n`);
                res.redirect(`/building?id=${req.query.buildingId}`);
            });
        });
    });

    app.post('/saveFS', urlEncodedParser, (req, res) => {
        //console.log(req.body);
        FSHandler.saveFS(req.body, (err, info) => {
            handleBuilding.updateColorNums(info.building.id, (err, result) => {
                res.redirect(`/FS?id=${info.id}`);
            });
        });
    });

    app.post('/quickUpdateFS', urlEncodedParser, (req, res) => {
        // console.log(req.body);
        FSHandler.quickUpdate(req.body.nextDateToCheck, req.body.FSId, (err) => {
            if (err) console.error('Error in avu quickUpdate...\n' + err);
            handleBuilding.updateColorNums(req.body.buildingId, (err) => {
                res.redirect(`/FS?id=${req.body.avuId}`);
            });
        });
    });

    app.post('/updateFS', urlEncodedParser, (req, res) => {
        //console.log(req.body);
        FSHandler.updateFs(req.body, (err, objectId) => {
            res.redirect('/FS?id=' + objectId);
        });
    });

    app.get('/editFS', (req, res) => {
        //console.log('this is the editAvu route that reroutes to /avu');
        //console.log(req.query.avuId);
        FSHandler.getFsInfo(req.query.FSId, (err, FSInfo) => {
            //console.log(JSON.stringify(FSInfo, null, 2));
            res.render('editFS', FSInfo);
        });
    });

    app.post('/addFilter', urlEncodedParser, (req, res) => {
        filterHandler.addFilter(req.body, req.body.id, (err, FSId) => {
            res.redirect(`/FS?id=${FSId}`);
        });
    });

    app.get('/removeFilter', (req, res) => {
        filterHandler.removeFilter(req.query.filterId, req.query.FSId, () => {
            res.redirect(`/FS?id=${req.query.FSId}`);
        });
    });
};
'use strict';

module.exports = (app) => {
    app.get('/avu/:id', (req, res) => {
        res.render('avu'/*, {avuContent}*/);
    });

    app.get('/createAvu', (req, res) => {
        console.log(req.query.id);
        console.log(req.query.buildingName);

        res.render('newAvu', {id: req.query.id, buildingName: req.query.buildingName, });
    });

    app.post('/saveAvu', (req, res) => {

    });

    app.post('/editAvu/:id', (req, res) => {
        console.log('this is the editAvu route that reroutes to /avu');
        res.render('avu'/*, {avuContent} */);
    });
};
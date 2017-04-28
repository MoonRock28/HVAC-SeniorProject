'use strict';

module.exports = (app) => {
    app.get('/avu/:id', (req, res) => {
        res.render('avu'/*, {avuContent}*/);
    });

    app.get('/createAvu', (req, res) => {


        res.render('newDocument', {docType: 'avu', name: req.query.buildingName, });
    });

    app.post('/saveAvu', (req, res) => {

    });

    app.post('/editAvu/:id', (req, res) => {
        console.log('this is the editAvu route that reroutes to /avu');
        res.render('avu'/*, {avuContent} */);
    });
};
'use strict';

module.exports = (app) => {
    app.get('/fan/:id', (req, res) => {
        res.render('fan'/*, {fanContent}*/);
    });

    app.get('/createFan', (req, res) => {
        res.render('newDocument'/*, {docType = fan} */);
    });

    app.post('/saveFan', (req, res) => {

    });

    app.post('/editFan/:id', (req, res) => {
        console.log('this is the editFan route that reroutes to /fan');
        res.render('fan'/*, {fanContent}*/);
    });
};
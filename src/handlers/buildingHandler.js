'use strict';
const buildingService = require('../services/serveBuilding');
const homeContent = require('../services/serveHomeContent');

function saveBuilding(body, callback){
    let newBuilding = {
        name: body.name
    };

    buildingService.newBuilding(newBuilding, (err, objectId) => {
        homeContent.getHomeContent( (err, record) => {
            record.buildings.push(newBuilding._id);
            homeContent.editHomeContent(record, record._id, (err) => {
                callback(null, objectId);
            });
        });
    });
}

module.exports = {
    saveBuilding: saveBuilding
};
'use strict';
const buildingService = require('../services/serveBuilding');
const homeContent = require('../services/serveHomeContent');

function saveBuilding(body, callback){
    let newBuilding = {
        name: body.buildingName
    };
    let homeObjectId = body.homeObjectId;

    buildingService.newBuilding(newBuilding, (err, objectId) => {
        homeContent.getHomeContent(homeObjectId, (err, record) => {
            record.buildings.push(newBuilding);
            homeContent.editHomeContent(record, homeObjectId, (err) => {
                callback(null, objectId);
            });
        });
    });
}

module.exports = {
    saveBuilding: saveBuilding
};
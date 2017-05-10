'use strict';
const buildingService = require('../services/serveBuilding');
const homeContent = require('../services/serveHomeContent');
const avuService = require('../services/serveAvu');

function saveAVU(body, callback) {
    let newAvu = {
        name: body.name,
        nextDateToCheck: body.nextDateToCheck,
        additionalNotes: body.additionalNotes
    };

    avuService.newAVU(newAvu, (err, objectId) => {
        homeContent.getHomeContent( (err, homeRecord) => {
            homeRecord.allAvus.push(objectId);
            homeContent.editHomeContent(homeRecord, homeRecord._id, (err) => {
                callback(null, objectId);
            });
        });
    });
}
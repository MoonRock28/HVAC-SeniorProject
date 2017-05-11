'use strict';
const buildingService = require('../services/serveBuilding');
const Building = require('./buildingHandler');
const homeContent = require('../services/serveHomeContent');
const avuService = require('../services/serveAvu');
const colorService = require('../services/serveColor');
const parallel = require('async').parallel;

function saveAVU(body, callback) {
    let functionArray = [], name, buildingId;
    let lastDate = new Date();
    let statusColor = colorService.getStatusColor(body.nextDateToCheck, lastDate);
    let newAvu = {
        name: body.name,
        nextDateToCheck: body.nextDateToCheck,
        lastDateMaintained: lastDate,
        statusColor: statusColor,
        additionalNotes: body.additionalNotes
    };

    avuService.newAVU(newAvu, (err, objectId) => {
        functionArray.push( (cb) => {
            homeContent.getHomeContent( (err, homeRecord) => {
                homeRecord.allAvus.push(objectId);
                homeContent.editHomeContent(homeRecord, homeRecord._id, (err) => {
                    cb(null, objectId);
                });
            });
        });
        functionArray.push( (cb) => {
            buildingService.getBuilding(body.buildingId, (err, buildingRecord) => {
                name = buildingRecord.name;
                buildingId = buildingRecord._id;
                buildingRecord.AVUs.push(objectId);
                buildingService.editBuilding(buildingRecord, buildingRecord._id, (err) => {
                    Building.updateColorNums(buildingRecord._id, (err) => {
                        cb(null, objectId);
                    });
                });
            });
        });

        parallel(functionArray, (err, results) => {
            if(err) console.error(err);
            callback(null, {id: objectId, building: {name: name, id: buildingId}});
        });
    });
}

function deleteAVU(objectId, callback) {

}

function getAvuInfo(objectId, callback) {

}

module.exports = {
    saveAVU: saveAVU,
    deleteAVU: deleteAVU,
    getAvuInfo: getAvuInfo
};
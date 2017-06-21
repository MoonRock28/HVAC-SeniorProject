'use strict';
const handleAvu = require('./avuHandler');
const handleFan = require('./fanHandler');
const buildingService = require('../services/serveBuilding');
const homeContent = require('../services/serveHomeContent');
const serveAvu = require('../services/serveAvu');
const serveFan = require('../services/serveFan');
// const serveMap = require('../services/serveMap');
const parallel = require('async').parallel;


function saveBuilding(body, callback){
    // console.log(body.lat + ", " + body.lng);
    let newBuilding = {
        name: body.name,
        coordinates: {lat: body.lat, lng: body.lng},
        numRed: 0,
        numBlack: 0
    };

    buildingService.newBuilding(newBuilding, (err, objectId) => {
        homeContent.getHomeContent( (err, record) => {
            // console.log(objectId);
            record.buildings.push(objectId);
            // console.log(record.buildings);
            homeContent.editHomeContent(record, record._id, (err) => {
                callback(null, objectId);
            });
        });
    });
}

function getBuildingInfo(objectId, callback) {
    buildingService.getBuilding(objectId, (err, record) => {
        let avuArray = [], fanArray= [], allArray = [];
        let avus = [], fans = [];

        if (record.AVUs !== undefined) {
            allArray.push( (allcb) => {
                avuArray = record.AVUs.map( (id) => {
                    return (cb) => {
                        serveAvu.getAVU(id, cb);
                    }
                });

                parallel(avuArray, (err, results) => {
                    //sort the array based on avu.nextDateToCheck value
                    results.sort(compareDate);
                    // save the sorted array to avus[]
                    results.forEach( (result) => {
                        avus.push(result)
                    });
                    allcb();
                });
            });
        }

        if (record.fans !== undefined) {
            allArray.push( (allcb) => {
                fanArray = record.fans.map( (id) => {
                    return (cb) => {
                        serveFan.getFan(id, cb);
                    }
                });

                parallel(fanArray, (err, results) => {
                    //sort the array based on fan.nextDateToCheck value
                    results.sort(compareDate);
                    // save the sorted array to fans[]
                    results.forEach( (result) => {
                        fans.push(result)
                    });
                    allcb();
                });
            });
        }

        function compareDate(a, b) {
            if(a.nextDateToCheck > b.nextDateToCheck)
                return -1;
            if(a.nextDateToCheck < b.nextDateToCheck)
                return 1;
            return 0;
        }

        parallel(allArray, (err, results) => {
            if (err) console.error(err);
            callback(null, {building: record, avus: avus, fans: fans})
        });
    });
}

function updateColorNums (objectId, callback) {
    getBuildingInfo(objectId, (err, info) => {
        let numBlack = 0, numRed = 0;

        info.avus.forEach( (avu) => {
            if (avu.statusColor === 'black') numBlack++;
            else if (avu.statusColor === 'red') numRed++;
        });

        info.fans.forEach( (fan) => {
            if (fan.statusColor === 'black') numBlack++;
            else if (fan.statusColor === 'red') numRed++;
        });

        info.building.numBlack = numBlack;
        info.building.numRed = numRed;

        buildingService.editBuilding(info.building, objectId, callback);
    });
}

function removeBuilding (buildingId, callback) {
    buildingService.getBuilding(buildingId, (err, buildingRecord) => {
        let functionArray = [];

        buildingRecord.AVUs.forEach( (avuId) => {
            functionArray.push( (cb) => {
                return handleAvu.deleteAVU(avuId, cb);
            });
        });

        buildingRecord.fans.forEach( (fanId) => {
            functionArray.push( (cb) => {
                return handleFan.deleteFan(fanId, buildingId, cb);
            });
        });

        parallel(functionArray, (err, results) => {
            buildingService.deleteBuilding(buildingId, callback);
        });
    });
}

function removeAvuFromList (buildingId, avuId, callback) {
    buildingService.getBuilding(buildingId, (err, buildingRecord) => {
        let avuIndex = buildingRecord.AVUs.indexOf(avuId);
        if(avuIndex > -1) {
            buildingRecord.AVUs.splice(avuIndex, 1);
        }
        buildingService.editBuilding(buildingRecord, buildingId, (err, result) => {
            updateColorNums(buildingId, callback);
        });
    });
}

function removeFanFromList (buildingId, fanId, callback) {
    buildingService.getBuilding(buildingId, (err, buildingRecord) => {
        let fanIndex = buildingRecord.fans.indexOf(fanId);
        if(fanIndex > -1) {
            buildingRecord.fans.splice(fanIndex, 1);
        }
        buildingService.editBuilding(buildingRecord, buildingId, (err, result) => {
            updateColorNums(buildingId, callback);
        });
    });
}

module.exports = {
    saveBuilding: saveBuilding,
    getBuildingInfo: getBuildingInfo,
    updateColorNums: updateColorNums,
    removeBuilding: removeBuilding,
    removeAvuFromList: removeAvuFromList,
    removeFanFromList: removeFanFromList
};
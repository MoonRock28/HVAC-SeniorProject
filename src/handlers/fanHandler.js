'use strict';
const buildingService = require('../services/serveBuilding');
const homeService = require('../services/serveHomeContent');
const serveFan = require('../services/serveFan');
const beltService = require('../services/serveBelt');
const colorService = require('../services/serveColor');
const parallel = require('async').parallel;

function saveFan(body, callback) {
    let functionArray = [], name, buildingId;
    let lastDate = new Date();
    let statusColor = colorService.getStatusColor(body.nextDateToCheck, lastDate);
    let newFan = {
        name: body.name,
        // googleMapSpot: body.googleMapSpot,
        floor: body.floor,
        mechanicalRoom: body.mechanicalRoom,
        nextDateToCheck: body.nextDateToCheck,
        lastDateMaintained: lastDate,
        statusColor: statusColor,
        additionalNotes: body.additionalNotes
    };

    serveFan.newFan(newFan, (err, objectId) => {
        functionArray.push( (cb) => {
            homeService.getHomeContent( (err, homeRecord) => {
                homeRecord.allFans.push(objectId);
                homeService.editHomeContent(homeRecord, homeRecord._id, (err) => {
                    cb(null, objectId);
                });
            });
        });
        functionArray.push( (cb) => {
            buildingService.getBuilding(body.buildingId, (err, buildingRecord) => {
                name = buildingRecord.name;
                buildingId = buildingRecord._id;
                buildingRecord.fans.push(objectId);
                buildingService.editBuilding(buildingRecord, buildingRecord._id, cb);
            });
        });

        parallel(functionArray, (err, results) => {
            if(err) console.error("Error in //saveFan...\n" + err);
            callback(null, {id: objectId, building: {name: name, id: buildingId}});
        });
    });
}

function deleteFan(fanId, callback) {
    serveFan.getFan(fanId, (err, fanRecord) => {
        let functionArray = [];

        // functionArray.push( (cb) => { return serveMap.delete}); not finished yet...

        fanRecord.belts.forEach( (beltId) => {
            functionArray.push( (cb) => {
                return beltService.deleteBelt(beltId, cb);
            });
        });
        fanRecord.extraBelts.forEach( (beltId) => {
            functionArray.push( (cb) => {
                return beltService.deleteBelt(beltId, cb);
            });
        });

        parallel(functionArray, (err, results) => {
            if (err) console.error("Error in deleting belts...\n" + err);
            serveFan.deleteFan(fanId, callback);
        });
    });
}

function getFanInfo(objectId, callback) {
    serveFan.getFan(objectId, (err, fanRecord) => {
        let belts = [],
            extras = [],
            allArray = [];

        allArray.push( (allcb) => {
            let functionArray = fanRecord.belts.map( (id) => {
                return (cb) => {
                    beltService.getBelt(id, cb);
                }
            });

            parallel(functionArray, (err, results) => {
                if (err) console.error("Error in getting belts...\n" + err);

                results.forEach( (belt) => {
                    belts.push(belt);
                });

                allcb();
            });
        });

        allArray.push( (allcb) => {
            let functionArray = fanRecord.extraBelts.map( (id) => {
                return (cb) => {
                    beltService.getBelt(id, cb);
                }
            });

            parallel(functionArray, (err, results) => {
                if (err) console.error("Error in getting belts...\n" + err);

                results.forEach( (belt) => {
                    extras.push(belt);
                });

                allcb();
            });
        });

        parallel(allArray, (err) => {
            if (err) console.error("Error in getting fan info...\n" + err);
            callback(null, {current: fanRecord, belts: belts, extras: extras});
        });

    });
}

module.exports = {
    saveFan: saveFan,
    deleteFan: deleteFan,
    getFanInfo: getFanInfo
};
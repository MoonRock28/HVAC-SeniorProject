'use strict';
const buildingService = require('../services/serveBuilding');
const homeService = require('../services/serveHomeContent');
const serveFan = require('../services/serveFan');
const beltService = require('../services/serveBelt');
const colorService = require('../services/serveColor');
const parallel = require('async').parallel;

function saveFan(body, callback) {
    let functionArray = [];
    let lastDate = new Date();
    let newFan;
    if (body.nextDateToCheck === undefined || body.nextDateToCheck === null || body.nextDateToCheck === "") {
        let statusColor = colorService.getStatusColor(lastDate, lastDate);
        newFan = {
            name: body.name,
            coordinates: {lat: body.lat, lng: body.lng},
            buildingName: body.buildingName,
            buildingId: body.buildingId,
            floor: body.floor,
            mechanicalRoom: body.mechanicalRoom,
            fanSheave: body.fanSheave,
            motorSheave: body.motorSheave,
            nextDateToCheck: lastDate,
            lastDateMaintained: lastDate,
            statusColor: statusColor,
            additionalNotes: body.additionalNotes
        };
    } else {
        let statusColor = colorService.getStatusColor(body.nextDateToCheck, lastDate);
        newFan = {
            name: body.name,
            coordinates: {lat: body.lat, lng: body.lng},
            buildingName: body.buildingName,
            buildingId: body.buildingId,
            floor: body.floor,
            mechanicalRoom: body.mechanicalRoom,
            fanSheave: body.fanSheave,
            motorSheave: body.motorSheave,
            nextDateToCheck: body.nextDateToCheck,
            lastDateMaintained: lastDate,
            statusColor: statusColor,
            additionalNotes: body.additionalNotes
        };
    }

    serveFan.newFan(newFan, (err, objectId) => {
        functionArray.push( (cb) => {
            homeService.getHomeContent( (err, homeRecord) => {
                homeRecord.allFans.push(objectId);
                homeService.editHomeContent(homeRecord, (err) => {
                    cb(null, objectId);
                });
            });
        });
        functionArray.push( (cb) => {
            buildingService.getBuilding(body.buildingId, (err, buildingRecord) => {
                buildingRecord.fans.push(objectId);
                buildingService.editBuilding(buildingRecord, buildingRecord._id, cb);
            });
        });

        parallel(functionArray, (err, results) => {
            if(err) console.error("Error in //saveFan...\n" + err);
            callback(null, {id: objectId, building: {name: body.buildingName, id: body.buildingId}});
        });
    });
}

function deleteFan(fanId, callback) {
    serveFan.getFan(fanId, (err, fanRecord) => {
        let functionArray = [];

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

function quickUpdate(nextDate, fanId, callback) {
    serveFan.getFan(fanId, (err, record) => {
        if (nextDate === undefined || nextDate === null || nextDate === "")
            record.nextDateToCheck = new Date();
        else
            record.nextDateToCheck = nextDate;
        record.lastDateMaintained = new Date();
        record.statusColor = colorService.getStatusColor(nextDate, record.lastDateMaintained);
        console.log("statusColor updated to " + record.statusColor);
        serveFan.editFan(record, fanId, callback);
    })
}

function updateFan(body, callback) {
    serveFan.getFan(body._id, (err, record) => {
        record.name = body.name;
        record.floor = body.floor;
        record.mechanicalRoom = body.mechanicalRoom;
        record.fanSheave = body.fanSheave;
        record.motorSheave = body.motorSheave;
        record.additionalNotes = body.additionalNotes;
        record.coordinates = {lat: body.lat, lng: body.lng};
        serveFan.editFan(record, body._id, callback);
    });
}

module.exports = {
    saveFan: saveFan,
    deleteFan: deleteFan,
    getFanInfo: getFanInfo,
    quickUpdate: quickUpdate,
    updateFan: updateFan
};
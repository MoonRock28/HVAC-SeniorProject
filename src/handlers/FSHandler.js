'use strict';
const buildingService = require('../services/serveBuilding');
const homeContent = require('../services/serveHomeContent');
const FSService = require('../services/serveFS');
const filterService = require('../services/serveFilter');
// const serveMap = require('../services/serveMap');
const colorService = require('../services/serveColor');
const parallel = require('async').parallel;

function saveFS(body, callback) {
    let functionArray = [];
    let lastDate = new Date();
    let statusColor = colorService.getStatusColor(body.nextDateToCheck, lastDate);
    let newFS = {
        name: body.name,
        coordinates: {lat: body.lat, lng: body.lng},
        buildingName: body.buildingName,
        buildingId: body.buildingId,
        floor: body.floor,
        mechanicalRoom: body.mechanicalRoom,
        nextDateToCheck: body.nextDateToCheck,
        lastDateMaintained: lastDate,
        statusColor: statusColor,
        additionalNotes: body.additionalNotes
    };
    //console.log(JSON.stringify(newAvu, null, 4));

    FSService.newFS(newFS, (err, objectId) => {
        functionArray.push( (cb) => {
            homeContent.getHomeContent( (err, homeRecord) => {
                homeRecord.allFSs.push(objectId);
                homeContent.editHomeContent(homeRecord, homeRecord._id, (err) => {
                    cb(null, objectId);
                });
            });
        });
        functionArray.push( (cb) => {
            buildingService.getBuilding(body.buildingId, (err, buildingRecord) => {
                buildingRecord.FSs.push(objectId);
                buildingService.editBuilding(buildingRecord, buildingRecord._id, cb);
            });
        });

        parallel(functionArray, (err, results) => {
            if(err) console.error(err);
            callback(null, {id: objectId, building: {name: body.buildingName, id: body.buildingId}});
        });
    });
}

function deleteFS(FsId, callback) {
    FSService.getFS(FsId, (err, FsRecord) => {
        let functionArray = [];

        if (FsRecord.primaryFilters !== null) {
            FsRecord.primaryFilters.forEach((filterId) => {
                functionArray.push((cb) => {
                    return filterService.deleteFilter(filterId, cb);
                });
            });
        }
        if (FsRecord.secondaryFilters !== null) {
            FsRecord.secondaryFilters.forEach((filterId) => {
                functionArray.push((cb) => {
                    return filterService.deleteFilter(filterId, cb);
                });
            });
        }
        if (FsRecord.extraFilters !== null) {
            FsRecord.extraFilters.forEach((filterId) => {
                functionArray.push((cb) => {
                    return filterService.deleteFilter(filterId, cb);
                });
            });
        }

        parallel(functionArray, (err, results) => {
            if(err) console.error("Error in deleting Filters...\n" + err);
            FSService.deleteFS(FsId, callback);
        });
    });

}

function getFsInfo(objectId, callback) {
    FSService.getFS(objectId, (err, FsRecord) => {
        let primaries = [],
            secondaries = [],
            extras = [],
            allArray = [],
            primary = FsRecord.primaryFilters,
            secondary = FsRecord.secondaryFilters,
            extra = FsRecord.extraFilters;

        allArray.push( (allcb) => {
            let functionArray = primary.map( (id) => {
                return (cb) => {
                    filterService.getFilter(id, cb);
                }
            });

            parallel(functionArray, (err, results) => {
                if (err) console.error(err);

                results.forEach( (filter) => {
                    primaries.push(filter);
                });

                allcb();
            });
        });

        allArray.push( (allcb) => {
            let functionArray = secondary.map( (id) => {
                return (cb) => {
                    filterService.getFilter(id, cb);
                }
            });

            parallel(functionArray, (err, results) => {
                if (err) console.error(err);

                results.forEach( (filter) => {
                    secondaries.push(filter);
                });

                allcb();
            });
        });

        allArray.push( (allcb) => {
            let functionArray = extra.map( (id) => {
                return (cb) => {
                    filterService.getFilter(id, cb);
                }
            });

            parallel(functionArray, (err, results) => {
                if (err) console.error(err);

                results.forEach( (filter) => {
                    extras.push(filter);
                });

                allcb();
            });
        });

        parallel(allArray, (err) => {
            if(err) console.error(err);
            callback(null, {current: FsRecord, primary: primaries, secondary: secondaries, extra: extras});
        });
    });
}

function quickUpdate(nextDate, FsId, callback) {
    FSService.getFS(FsId, (err, record) => {
        record.nextDateToCheck = nextDate;
        record.lastDateMaintained = new Date();
        record.statusColor = colorService.getStatusColor(nextDate, record.lastDateMaintained);
        console.log("statusColor updated to " + record.statusColor);
        FSService.editFS(record, FsId, callback);
    })
}

function updateFs(body, callback) {
    FSService.getFS(body._id, (err, record) => {
        record.name = body.name;
        record.floor = body.floor;
        record.mechanicalRoom = body.mechanicalRoom;
        record.additionalNotes = body.additionalNotes;
        record.coordinates = {lat: body.lat, lng: body.lng};
        FSService.editFS(record, body._id, callback);
    });
}

module.exports = {
    saveFS: saveFS,
    deleteFS: deleteFS,
    getFsInfo: getFsInfo,
    quickUpdate: quickUpdate,
    updateFs: updateFs
};
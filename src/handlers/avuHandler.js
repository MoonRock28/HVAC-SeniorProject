'use strict';
const buildingService = require('../services/serveBuilding');
const homeContent = require('../services/serveHomeContent');
const avuService = require('../services/serveAvu');
const filterService = require('../services/serveFilter');
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
                buildingService.editBuilding(buildingRecord, buildingRecord._id, cb);
            });
        });

        parallel(functionArray, (err, results) => {
            if(err) console.error(err);
            callback(null, {id: objectId, building: {name: name, id: buildingId}});
        });
    });
}

function deleteAVU(avuId, callback) {

        // if (err) console.error("Error in deleteAVU/Building.removeAvuFromList" + err);
    avuService.getAVU(avuId, (err, avuRecord) => {
        let functionArray = [];

        avuRecord.primaryFilters.forEach( (filterId) => {
            functionArray.push( (cb) => {
                return filterService.deleteFilter(filterId, cb);
            });
        });
        avuRecord.secondaryFilters.forEach( (filterId) => {
            functionArray.push( (cb) => {
                return filterService.deleteFilter(filterId, cb);
            });
        });
        avuRecord.extraFilters.forEach( (filterId) => {
            functionArray.push( (cb) => {
                return filterService.deleteFilter(filterId, cb);
            });
        });

        parallel(functionArray, (err, results) => {
            if(err) console.error("Error in deleting Filters...\n" + err);
            avuService.deleteAVU(avuId, callback);
        });
    });

}

function getAvuInfo(objectId, callback) {
    avuService.getAVU(objectId, (err, avuRecord) => {
        let primaries = [],
            secondaries = [],
            extras = [],
            allArray = [],
            primary = avuRecord.primaryFilters,
            secondary = avuRecord.secondaryFilters,
            extra = avuRecord.extraFilters;

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
            callback(null, {current: avuRecord, primary: primaries, secondary: secondaries, extra: extras});
        });
    });
}

module.exports = {
    saveAVU: saveAVU,
    deleteAVU: deleteAVU,
    getAvuInfo: getAvuInfo
};
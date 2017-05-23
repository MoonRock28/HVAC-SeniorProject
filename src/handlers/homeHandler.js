'use strict';
const handleBuilding = require('./buildingHandler');
const serveHome = require('../services/serveHomeContent');
const serveBuilding = require('../services/serveBuilding');
const serveAvu = require('../services/serveAvu');
const serveFan = require('../services/serveFan');
const parallel = require('async').parallel;

function parseHome(callback) {
    serveHome.getHomeContent( (err, record) => {
        let buildings = [], avus = [], fans = [],
            buildArray, avuArray, fanArray, allArray = [];

        // console.log(record.buildings);
        if (record.buildings !== undefined && record.buildings.length > 0) {
            allArray.push( (allcb) => {
                buildArray = record.buildings.map( (id) => {
                    return (cb) => {
                        serveBuilding.getBuilding(id, cb);
                    }
                });

                parallel(buildArray, (err, results) => {
                    // sort the array based on highest number of numBlacks.
                    results.forEach( (building) => {
                        // console.log(building);
                        handleBuilding.updateColorNums(building._id, (err, objectId) => {
                            if (err) console.error(err);
                        });
                    });
                    // console.log(handleBuilding);

                    results.sort(compareNumBlack);

                    // save the sorted array to buildings[]
                    results.forEach( (result) => {
                        buildings.push(result);
                    });

                    allcb();
                });
            })
        }

        // console.log(record.allAvus);
        if (record.allAvus !== undefined) {
            // console.log('getting AVUs for home content...');
            allArray.push( (allcb) => {
                    avuArray = record.allAvus.map( (id) => {
                        return (cb) => {
                            // console.log(id);
                            serveAvu.getAVU(id, cb);
                        }
                    });

                    parallel(avuArray, (err, results) => {
                        // sort the array based on avu.nextDateToCheck value
                        // if (results.length > 1)
                        //     results.sort(compareDate);

                        // save the sorted array to avus[]
                        results.forEach((result) => {
                            avus.push(result);
                        });
                        allcb();
                    });
                })
        }

        if (record.allFans !== undefined) {
            // console.log('getting fans for home content...');
            allArray.push(
                (allcb) => {
                    fanArray = record.allFans.map( (id) => {
                        return (cb) => {
                            // console.log(id);
                            serveFan.getFan(id, cb);
                        }
                    });

                    parallel(fanArray, (err, results) => {
                        // sort the array based on fan.nextDateToCheck value
                        // if (results.length > 1)
                        //     results.sort(compareDate);
                        // save the sorted array to fans[]
                        results.forEach((result) => {
                            fans.push(result);
                        });
                        allcb();
                    });
                })
        }

        function compareNumBlack(a, b) {
            if(a.numBlack > b.numBlack)
                return 1;
            if(a.numBlack < b.numBlack)
                return -1;
            return 0;
        }

        function compareDate(a, b) {
            if(a.nextDateToCheck > b.nextDateToCheck)
                return -1;
            if(a.nextDateToCheck < b.nextDateToCheck)
                return 1;
            return 0;
        }

        parallel(allArray, (err, result) => {
            // console.log(avus);
            // console.log(fans);
            callback(null, {buildings: buildings, avus: avus, fans: fans});
        });
    });
}

function removeBuildingFromList(buildingId, callback) {
    serveHome.getHomeContent( (err, homeRecord) => {
        let index = homeRecord.buildings.indexOf(buildingId);
        if (index > -1) {
            homeRecord.buildings.splice(index, 1);
        }
        serveHome.editHomeContent(homeRecord, homeRecord._id, (err) => {
            if (err) console.error("Error in removing building from homeRecord" + err);
            callback(null);
        });

    });
}

function removeAvuFromList(avuId, callback) {
    serveHome.getHomeContent((err, homeContent) => {
        let avuIndex = homeContent.allAvus.indexOf(avuId);
        if (avuIndex > -1) {
            homeContent.allAvus.splice(avuIndex, 1);
        }
        serveHome.editHomeContent(homeContent, homeContent._id, callback);
    });
}

function removeFanFromList(fanId, callback) {
    serveHome.getHomeContent((err, homeContent) => {
        let fanIndex = homeContent.allFans.indexOf(fanId);
        if (fanIndex > -1) {
            homeContent.allFans.splice(fanIndex, 1);
        }
        serveHome.editHomeContent(homeContent, homeContent._id, callback);
    });
}

module.exports = {
    parseHome: parseHome,
    removeBuildingFromList: removeBuildingFromList,
    removeAvuFromList: removeAvuFromList,
    removeFanFromList: removeFanFromList
};
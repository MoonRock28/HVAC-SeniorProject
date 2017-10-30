'use strict';
const handleBuilding = require('./buildingHandler');
const serveHome = require('../services/serveHomeContent');
const serveBuilding = require('../services/serveBuilding');
const serveFS = require('../services/serveFS');
const serveFan = require('../services/serveFan');
// const serveMap = require('../services/serveMap');
const serveColor = require('../services/serveColor');
const parallel = require('async').parallel;

function parseHome(callback) {
    serveHome.getHomeContent( (err, record) => {
        let buildings = [], FSs = [], fans = [],
            buildArray, FSArray, fanArray, allArray = [];

        // console.log(record.buildings);
        if (record.buildings !== undefined && record.buildings.length > 0) {
            allArray.push( (allcb) => {
                buildArray = record.buildings.map( (id) => {
                    return (cb) => {
                        handleBuilding.updateColorNums(id, (err) => {
                            serveBuilding.getBuilding(id, (err, record) => {
                                cb(null, record);
                            });
                        });
                    }
                });

                parallel(buildArray, (err, results) => {
                    // sort the array based on highest number of numBlacks.
                    // results.forEach( (building) => {
                    //     // console.log(building);
                    //     handleBuilding.updateColorNums(building._id, (err, objectId) => {
                    //         if (err) console.error(err);
                    //     });
                    //
                    // });
                    // console.log(handleBuilding);
                    results.sort(compareNumRed); //start sort
                    results.sort(compareNumBlack); //overriding sort

                    // save the sorted array to buildings[]
                    results.forEach( (result) => {
                        buildings.push(result);
                    });

                    allcb();
                });
            })
        }

        // console.log(record.allFSs);
        if (record.allFSs !== undefined) {
            // console.log('getting FSs for home content...');
            allArray.push( (allcb) => {
                    FSArray = record.allFSs.map( (id) => {
                        return (cb) => {
                            // console.log(id);
                            serveFS.getFS(id, cb);
                        }
                    });

                    parallel(FSArray, (err, results) => {
                        // sort the array based on avu.nextDateToCheck value
                        // if (results.length > 1)
                        //     results.sort(compareDate);

                        // save the sorted array to FSs[]
                        results.forEach((result) => {
                            FSs.push(result);
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
                        if (results.length > 1)
                            results.sort(compareDate);
                        // save the sorted array to fans[]
                        results.forEach((result) => {
                            fans.push(result);
                        });
                        allcb();
                    });
                })
        }

        function compareNumRed(a, b) {
            if(a.numRed > b.numRed)
                return -1;
            if(a.numRed < b.numRed)
                return 1;
            return 0;
        }

        function compareNumBlack(a, b) {
            if(a.numBlack > b.numBlack)
                return -1;
            if(a.numBlack < b.numBlack)
                return 1;
            return 0;
        }

        function compareDate(a, b) {
            if(a.nextDateToCheck > b.nextDateToCheck)
                return 1;
            if(a.nextDateToCheck < b.nextDateToCheck)
                return -1;
            return 0;
        }

        parallel(allArray, (err, result) => {
            // console.log(FSs);
            // console.log(fans);
            callback(null, {buildings: buildings, FSs: FSs, fans: fans});
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

function removeFSFromList(FsId, callback) {
    serveHome.getHomeContent((err, homeContent) => {
        let FSIndex = homeContent.allFSs.indexOf(FsId);
        if (FSIndex > -1) {
            homeContent.allFSs.splice(FSIndex, 1);
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

function dailyColorUpdate(callback) {
    serveHome.getHomeContent( (err, homeRecord) => {
        if (homeRecord.colorCheckDate.getDay() !== new Date().getDay()) {
            //get info
            parseHome( (err, info) => {
                let allArray = [], FSArray = [], fanArray = [];

                //update status color of FSs
                allArray.push( (allcb) => {
                    FSArray = info.FSs.map( (FS) => {
                        return (cb) => {
                            FS.statusColor = serveColor.getStatusColor(FS.nextDateToCheck, FS.lastDateMaintained);
                            serveFS.editFS(FS, FS._id, cb);
                        }
                    });

                    parallel(FSArray, (err, results) => {
                        if (err) console.error("Error in dailyColorUpdate in FSs..." + err);
                        allcb();
                    });
                });


                //update status color of fans
                allArray.push( (allcb) => {
                    fanArray = info.fans.map( (fan) => {
                        return (cb) => {
                            fan.statusColor = serveColor.getStatusColor(fan.nextDateToCheck, fan.lastDateMaintained);
                            serveFan.editFan(fan, fan._id, cb);
                        }
                    });
                    parallel(fanArray, (err, results) => {
                        if (err) console.error("Error in dailyColorUpdate in Fans..." + err);
                        allcb();
                    });
                });

                parallel(allArray, (err, results) => {
                    if (err) console.error("Error in updating colors..." + err);
                    callback(true);
                });
            });
        } else {
            console.log("Color Update not needed...");
            callback(false);
        }
    });
}

module.exports = {
    parseHome: parseHome,
    removeBuildingFromList: removeBuildingFromList,
    removeFSFromList: removeFSFromList,
    removeFanFromList: removeFanFromList
};
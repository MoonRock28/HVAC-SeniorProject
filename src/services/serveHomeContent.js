'use strict';
const Home = require('../models/homeContent');
const parallel = require('async').parallelLimit;

function getHomeContent(callback) {
    Home.findOne({}).then( (record) => {
        // console.log(record);
        callback(null, record);
    }).catch((err) => {
        console.log(err);
    });
}

function editHomeContent(home, callback) {
    Home.findOne({}).then( (record) => {
        // console.log(home);
        record.buildings = home.buildings;
        record.allFSs = home.allFSs;
        record.allFans = home.allFans;
        record.colorCheckDate = home.colorCheckDate;
        record.save().then( () => {
            console.log('Home Content Updated...');
            callback(null);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}

function newHomeContent(home, callback) {
    let thisHome = new Home({
        buildings: home.buildings,
        allAvus: home.allFSs,
        allFans: home.allFans,
        colorCheckDate: home.colorCheckDate
    });

    thisHome.save().then( () => {
        callback(null, thisHome._id);
    }).catch((err) => {
        console.log(err);
    });
}

function deleteHomeContent(objectId, callback) {
    Home.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    }).catch((err) => {
        console.log(err);
    });
}

function removeFansFSsFromList(fans, FSs, callback) {
    let functionArray = [];

    if (fans !== null) {
        fans.forEach( (fanId) => {
            functionArray.push( (cb) => {
                return removeFanFromList(fanId, cb)
            });
        });
    }
    if (FSs !== null) {
        FSs.forEach( (FSId) => {
            functionArray.push( (cb) => {
                return removeFSFromList(FSId, cb)
            });
        });
    }

    parallel(functionArray, 1, (err, results) => {
        if (err) console.error("Error in removing FSs and Fans from homeContent...\n" + err);
        callback(null);
    });
}

function removeFSFromList(FSId, callback) {
    getHomeContent( (err, record) => {
        let FSIndex = record.allFSs.indexOf(FSId);
        if (FSIndex > -1) {
            record.allFSs.splice(FSIndex, 1);
        }

        record.save().then( (err) => {
            console.log("FS " + FSId + " has been removed from homeContent...");
            callback(null);
        });
    });
}

function removeFanFromList(fanId, callback) {
    getHomeContent( (err, record) => {
        let fanIndex = record.allFans.indexOf(fanId);
        if (fanIndex > -1) {
            record.allFans.splice(fanIndex, 1);
        }

        record.save().then( (err) => {
            console.log("Fan " +fanId + " has been removed from homeContent...");
            callback(null);
        });
    });
}

module.exports = {
    getHomeContent: getHomeContent,
    editHomeContent: editHomeContent,
    newHomeContent: newHomeContent,
    deleteHomeContent: deleteHomeContent,
    removeFansFSsFromList: removeFansFSsFromList
    // removeFSFromList: removeFSFromList,
    // removeFanFromList: removeFanFromList
};
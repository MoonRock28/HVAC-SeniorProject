'use strict';
const Home = require('../models/homeContent');

function getHomeContent(callback) {
    Home.findOne().then( (record) => {
        callback(null, record);
    });
}

function editHomeContent(home, objectId, callback) {
    Home.findOne({_id: objectId}).then( (record) => {
        record.buildings = home.buildings;
        record.allAvus = home.allAvus;
        record.allFans = home.allFans;
        record.save().then( () => {
            callback(null, objectId);
        });
    });
}

function newHomeContent(home, callback) {
    let thisHome = new Home({
        buildings: home.buildings,
        allAvus: home.allAvus,
        allFans: home.allFans
    });

    thisHome.save().then( () => {
        callback(null, thisHome._id);
    });
}

function deleteHomeContent(objectId, callback) {
    Home.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

module.exports = {
    getHomeContent: getHomeContent,
    editHomeContent: editHomeContent,
    newHomeContent: newHomeContent,
    deleteHomeContent: deleteHomeContent
};
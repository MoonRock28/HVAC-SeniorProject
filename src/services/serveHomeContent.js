'use strict';
const Home = require('../models/homeContent');

function getHomeContent(callback) {
    Home.findOne({}).then( (record) => {
        callback(null, record);
    }).catch((err) => {
        console.log(err);
    });
}

function editHomeContent(home, objectId, callback) {
    Home.findOne({_id: objectId}).then( (record) => {
        console.log(home);
        record.buildings = home.buildings;
        record.allAvus = home.allAvus;
        record.allFans = home.allFans;
        record.save().then( () => {
            console.log('Home Content Updated...');
            callback(null, objectId);
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
        allAvus: home.allAvus,
        allFans: home.allFans
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

module.exports = {
    getHomeContent: getHomeContent,
    editHomeContent: editHomeContent,
    newHomeContent: newHomeContent,
    deleteHomeContent: deleteHomeContent
};
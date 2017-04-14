'use strict';
const mongoose = require('mongoose');
const Fan = require('../models/fan');
const belt = require('./serveBelt');
const location = require('./serveLocation');

function getFan(objectId, callback) {
    Fan.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

function editFan(fan, objectId, callback) {
    Fan.findOne({_id: objectId}).then( (record) => {
        record.name = fan.name;
        record.location;
    });
}

function updateBelts(existing, updates, extra, callback) {
    let results = [];

    if(existing.length !== updates.length) {

        updates.forEach( (updateBelt) => {

            existing.forEach( (existingBelt) => {

                if (existingBelt !== updateBelt) {

                }
            });

        });

    }

}

function updateLocation(location, callback) {

}

function newFan(fan, callback) {

}

function deleteFan(objectId, callback) {

}

module.exports = {
    getFan: getFan,
    editFan: editFan,
    newFan: newFan,
    deleteFan: deleteFan
}
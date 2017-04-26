'use strict';
const mongoose = require('mongoose');
const ItemLocation = require('../models/itemLocation');

function getLocation(objectId, callback) {
    ItemLocation.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

function editLocation(location, objectId, callback) {
    ItemLocation.findOne({_id: objectId}).then( (record) => {
        record.floor = location.floor;
        // record.googleMapSpot = location.googleMapSpot;
        record.mechanicalRoom = location.mechanicalRoom;
        record.save().then( () => {
            callback(null, objectId);
        });
    });
}

function newLocation(location, callback) {
    let itemLocation = new ItemLocation({
        floor: location.floor,
        mechanicalRoom: location.mechanicalRoom
    });

    itemLocation.save().then( () => {
        callback(null, itemLocation._id);
    });
}

function deleteLocation(objectId, callback) {
    ItemLocation.findOneAndDelete({_id: objectId}).then( () => {
        callback(null);
    });
}

module.exports = {
    getLocation: getLocation,
    editLocation: editLocation,
    newLocation: newLocation,
    deleteLocation: deleteLocation
};
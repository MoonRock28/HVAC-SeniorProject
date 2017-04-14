'use strict';
const mongoose = require('mongoose');
const ItemLocation = require('../models/itemLocation');
const Map = require('./serveMap');

function getLocation(objectId, callback) {
    ItemLocation.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

function editLocation(location, objectId, callback) {
    ItemLocation.findOne({_id: objectId}).then( (record) => {
        // if (record.googleMapSpot !== location.googleMapSpot) {
        //     Map.editMap(location.map, record.googleMapSpot, (err, mapId) => {
        //         if (err) console.error(err);
        //         else {
        //             record.floor = location.floor;
        //             record.googleMapSpot = mapId;
        //             record.mechanicalRoom = location.mechanicalRoom;
        //             record.save().then( () => {
        //                 callback(null, objectId);
        //             });
        //         }
        //     });
        // } else {
            record.floor = location.floor;
            // record.googleMapSpot = location.googleMapSpot;
            record.mechanicalRoom = location.mechanicalRoom;
            record.save().then( () => {
                callback(null, objectId);
            });
        // }
    });
}

function newLocation(location, callback) {
    // Map.newMap(location.googleMapSpot, (err, objectId) => {
        let itemLocation = new ItemLocation({
            floor: location.floor,
            // googleMapSpot: objectId,
            mechanicalRoom: location.mechanicalRoom
        });

        itemLocation.save().then( () => {
            callback(null, itemLocation._id);
        });
    // });
}

function deleteLocation(objectId, callback) {
    // ItemLocation.findOne({_id: objectId}).then( (record) => {
    //     Map.deleteMap(record.googleMapSpot, (err) => {
    //         if (err) console.error(err);
            ItemLocation.findOneAndDelete({_id: objectId}).then( () => {
                callback(null);
            });
    //     });
    // });

}

module.exports = {
    getLocation: getLocation,
    editLocation: editLocation,
    newLocation: newLocation,
    deleteLocation: deleteLocation
};
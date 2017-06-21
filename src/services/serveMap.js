'use strict';
const mongoose = require('mongoose');
const Map = require('../models/googleMap');

function getMap(objectId, callback) {
    Map.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

function editMap(map, objectId, callback) {
    Map.findOne({_id: objectId}).then( (record) => {
        record.coordinates = map.coordinates;
        record.zoom = map.zoom;
        record.save().then( () => {
            callback(null, objectId);
        })
    });
}

function newMap(map, callback) {
    let thisMap = new Map({
        coordinates: map.coordinates,
        zoom: map.zoom
    });

    thisMap.save().then( () => {
        callback(null, thisFan._id);
    });
}

function deleteMap(objectId, callback) {
    Map.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

//these functions must be implemented before being exported.
module.exports = {
    getMap: getMap,
    editMap: editMap,
    newMap: newMap,
    deleteMap: deleteMap
};
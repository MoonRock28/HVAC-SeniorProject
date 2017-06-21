'use strict';
const mongoose = require('mongoose');
const Fan = require('../models/fan');

function getFan(objectId, callback) {
    Fan.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

function editFan(fan, objectId, callback) {
    Fan.findOne({_id: objectId}).then( (record) => {
        record.name = fan.name;
        record.coordinates = {lat: fan.coordinates.lat, lng: fan.coordinates.lng};
        record.buildingName = fan.buildingName;
        record.buildingId = fan.buildingId
        record.floor = fan.floor;
        record.mechanicalRoom = fan.mechanicalRoom;
        record.fanSheave = fan.fanSheave;
        record.motorSheave = fan.motorSheave;
        record.belts = fan.belts;
        record.extraBelts = fan.extraBelts;
        record.nextDateToCheck = fan.nextDateToCheck;
        record.lastDateMaintained = fan.lastDateMaintained;
        record.statusColor = fan.statusColor;
        record.additionalNotes = fan.additionalNotes;
        record.save().then( () => {
            callback(null, objectId);
        });
    });
}

function newFan(fan, callback) {
    let thisFan = new Fan({
        name: fan.name,
        coordinates: {lat: fan.coordinates.lat, lng: fan.coordinates.lng},
        buildingName: fan.buildingName,
        buildingId: fan.buildingId,
        floor: fan.floor,
        mechanicalRoom: fan.mechanicalRoom,
        fanSheave: fan.fanSheave,
        motorSheave: fan.motorSheave,
        nextDateToCheck: fan.nextDateToCheck,
        lastDateMaintained: fan.lastDateMaintained,
        statusColor: fan.statusColor,
        additionalNotes: fan.additionalNotes
    });

    thisFan.save().then( () => {
        callback(null, thisFan._id);
    });
}

function deleteFan(objectId, callback) {
    Fan.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

module.exports = {
    getFan: getFan,
    editFan: editFan,
    newFan: newFan,
    deleteFan: deleteFan
};
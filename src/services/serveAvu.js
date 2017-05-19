'use strict';
const AVU = require('../models/AVUs');

function newAVU(avu, callback) {
    let thisAVU = new AVU({
        name: avu.name,
        // googleMapSpot: avu.googleMapSpot,
        buildingName: avu.buildingName,
        buildingId: avu.buildingId,
        floor: avu.floor,
        mechanicalRoom: avu.mechanicalRoom,
        nextDateToCheck: avu.nextDateToCheck,
        lastDateMaintained: avu.lastDateMaintained,
        statusColor: avu.statusColor,
        additionalNotes: avu.additionalNotes
    });

    thisAVU.save().then( () => {
        callback(null, thisAVU._id);
    });
}

function editAVU(avu, objectId, callback) {
    AVU.findOne({_id: objectId}).then( (record) => {
        record.name = avu.name;
        // record.googleMapSpot = avu.googleMapSpot;
        record.buildingName = avu.buildingName;
        record.buildingId = avu.buildingId;
        record.floor = avu.floor;
        record.mechanicalRoom = avu.mechanicalRoom;
        record.primaryFilters = avu.primaryFilters;
        record.secondaryFilters = avu.secondaryFilters;
        record.extraFilters = avu.extraFilters;
        record.nextDateToCheck = avu.nextDateToCheck;
        record.lastDateMaintained = avu.lastDateMaintained;
        record.statusColor = avu.statusColor;
        record.additionalNotes = avu.additionalNotes;
        record.save().then( () => {
            callback(null, objectId);
        });
    });
}

function deleteAVU(objectId, callback) {
    AVU.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

function getAVU(objectId, callback) {
    AVU.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

module.exports = {
    newAVU: newAVU,
    editAVU: editAVU,
    deleteAVU: deleteAVU,
    getAVU: getAVU
};
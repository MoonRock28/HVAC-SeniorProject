'use strict';
const FS = require('../models/filtrationSystem');

function newFS(fs, callback) {
    let thisFS = new FS({
        name: fs.name,
        coordinates: {lat: fs.coordinates.lat, lng: fs.coordinates.lng},
        buildingName: fs.buildingName,
        buildingId: fs.buildingId,
        floor: fs.floor,
        mechanicalRoom: fs.mechanicalRoom,
        nextDateToCheck: fs.nextDateToCheck,
        lastDateMaintained: fs.lastDateMaintained,
        statusColor: fs.statusColor,
        additionalNotes: fs.additionalNotes
    });

    thisFS.save().then( () => {
        callback(null, thisFS._id);
    });
}

function editFS(fs, objectId, callback) {
    FS.findById(objectId).then( (record) => {
        record.name = fs.name;
        record.coordinates = {lat: fs.coordinates.lat, lng: fs.coordinates.lng};
        record.buildingName = fs.buildingName;
        record.buildingId = fs.buildingId;
        record.floor = fs.floor;
        record.mechanicalRoom = fs.mechanicalRoom;
        record.primaryFilters = fs.primaryFilters;
        record.secondaryFilters = fs.secondaryFilters;
        record.extraFilters = fs.extraFilters;
        record.nextDateToCheck = fs.nextDateToCheck;
        record.lastDateMaintained = fs.lastDateMaintained;
        record.statusColor = fs.statusColor;
        record.additionalNotes = fs.additionalNotes;
        record.save().then( () => {
            callback(null, objectId);
        });
    });
}

function deleteFS(objectId, callback) {
    FS.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

function getFS(objectId, callback) {
    FS.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

module.exports = {
    newFS: newFS,
    editFS: editFS,
    deleteFS: deleteFS,
    getFS: getFS
};
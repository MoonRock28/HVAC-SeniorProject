'use strict';
const mongoose = require('mongoose');
const Building = require('../models/building');

function newBuilding(building, callback) {
    let thisBuilding = new Building({
        name: building.name
    });

    thisBuilding.save().then( () => {
        callback(null, thisBuilding._id);
    });
}

function editBuilding(building, objectId, callback) {
    Building.findOne({_id: objectId}).then( (record) => {
        record.name = building.name;
        record.numBlack = building.numBlack;
        record.numRed = building.numRed;
        record.save().then( () => {
            callback(null, objectId)
        });
    });
}

function deleteBuilding(objectId, callback) {
    Building.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

function getBuilding(objectId, callback) {
    Building.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

module.exports = {
    newBuilding: newBuilding,
    editBuilding: editBuilding,
    deleteBuilding: deleteBuilding,
    getBuilding: getBuilding
};

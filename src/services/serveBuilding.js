'use strict';
const Building = require('../models/building');

function newBuilding(building, callback) {
    console.log(building);
    let thisBuilding = new Building({
        name: building.name // ,
        // googleMapSpot: building.googleMapSpot
    });

    thisBuilding.save().then(() => {
        console.log(building.name + ' building has been saved...');
        callback(null, thisBuilding._id);
    }).catch((err) => {
        console.log(err);
    });

}

function editBuilding(building, objectId, callback) {
    Building.findOne({_id: objectId}).then( (record) => {
        record.name = building.name;
        // record.googleMapSpot = building.googleMapSpot;
        record.AVUs = building.AVUs;
        record.fans = building.fans;
        record.numBlack = building.numBlack;
        record.numRed = building.numRed;
        record.save().then( () => {
            console.log(record.name + ' building has been updated...');
            callback(null, objectId)
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}

function deleteBuilding(objectId, callback) {
    Building.findOneAndRemove({_id: objectId}).then( () => {
        console.log('Building has been deleted...');
        callback(null);
    }).catch((err) => {
        console.log(err);
    });
}

function getBuilding(objectId, callback) {
    Building.findOne({_id: objectId}).then( (record) => {
        console.log(record.name + ' building has been found...');
        callback(null, record);
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = {
    newBuilding: newBuilding,
    editBuilding: editBuilding,
    deleteBuilding: deleteBuilding,
    getBuilding: getBuilding
};

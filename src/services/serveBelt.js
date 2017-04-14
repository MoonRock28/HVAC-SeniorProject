'use strict';
const mongoose = require('mongoose');
const Belt = require('../models/belt');

function getBelt(objectId, callback) {
    Belt.findOne({_id: objectId}).then( (record) => {
        callback(null, record);
    });
}

function editBelt(belt, objectId, callback) {
    Belt.findOne({_id: objectId}).then( (record) => {
        record.type = belt.type;
        record.amount = belt.amount;
        record.save().then( () => {
            callback(null, objectId)
        });
    });
}

function newBelt(belt, callback) {
    let thisBelt = new Belt({
        type: belt.type,
        amount: belt.amount
    });

    thisBelt.save().then( () => {
        callback(null, thisBelt._id);
    });
}

function deleteBelt(objectId, callback) {
    Belt.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

module.exports = {
    getBelt: getBelt,
    editBelt: editBelt,
    newBelt: newBelt,
    deleteBelt: deleteBelt
};
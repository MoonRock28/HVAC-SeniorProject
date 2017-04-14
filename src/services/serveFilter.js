'use strict';
const mongoose = require('mongoose');
const Filter = require('../models/filter');

function getFilter(objectId, callback) {
    Filter.findOne({_id: objectId}).then( (record) => {
        callback(null, record)
    });
}

function editFilter(filter, objectId, callback) {
    Filter.findOne({_id: objectId}).then( (record) => {
        record.width = filter.width;
        record.height = filter.height;
        record.depth = filter.depth;
        record.amount = filter.amount;
        record.save().then( () => {
            callback(null, objectId);
        });
    });
}

function newFilter(filter, callback) {
    let thisFilter = new Filter({
        width: filter.width,
        height: filter.height,
        depth: filter.depth,
        amount: filter.amount
    });

    thisFilter.save().then( () => {
        callback(null, thisFilter._id);
    });
}

function deleteFilter(objectId, callback) {
    Filter.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

module.exports = {
    getFilter: getFilter,
    editFilter: editFilter,
    newFilter: newFilter,
    deleteFilter: deleteFilter
};
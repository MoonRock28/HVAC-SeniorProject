'use strict';
const serveFilter = require('../services/serveFilter');
const serveAvu = require('../services/serveAvu');

function addFilter(filter, avuId, callback) {
    let type = filter.type;
    let newFilter = {
        width: filter.width,
        height: filter.height,
        depth: filter.depth,
        amount: filter.amount
    };

    serveFilter.newFilter(newFilter, (err, objectId) => {
        serveAvu.getAVU(avuId, (err, avuRecord) => {
            if (type = 'primary') {
                avuRecord.primaryFilters.push(objectId)
            } else if (type = 'secondary') {
                avuRecord.secondaryFilters.push(objectId)
            } else if (type = 'extra') {
                avuRecord.extraFilters.push(objectId)
            }
            serveAvu.editAVU(avuRecord, avuId, callback);
        });
    });
}

function removeFilter(filterId, avuId, callback) {

}

module.exports = {
    addFilter: addFilter,
    removeFilter: removeFilter
};
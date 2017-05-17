'use strict';
const serveFilter = require('../services/serveFilter');
const serveAvu = require('../services/serveAvu');

function addFilter(filter, avuId, callback) {
    // console.log('id is: ' + avuId);
    let type = filter.type;
    let newFilter = {
        width: filter.width,
        height: filter.height,
        depth: filter.depth,
        amount: filter.amount
    };

    serveFilter.newFilter(newFilter, (err, objectId) => {
        serveAvu.getAVU(avuId, (err, avuRecord) => {
            if (type === 'primary') {
                avuRecord.primaryFilters.push(objectId)
            } else if (type === 'secondary') {
                avuRecord.secondaryFilters.push(objectId)
            } else if (type === 'extra') {
                avuRecord.extraFilters.push(objectId)
            }
            serveAvu.editAVU(avuRecord, avuId, callback);
        });
    });
}

function removeFilter(filterId, avuId, callback) {
    serveFilter.deleteFilter(filterId, () => {
        serveAvu.getAVU(avuId, (err, avuRecord) => {
            let filterIndex = avuRecord.primaryFilters.indexOf(filterId);
            if (filterIndex > -1) {
                avuRecord.primaryFilters.splice(filterIndex, 1);
            }

            filterIndex = avuRecord.secondaryFilters.indexOf(filterId);
            if (filterIndex > -1) {
                avuRecord.secondaryFilters.splice(filterIndex, 1);
            }

            filterIndex = avuRecord.extraFilters.indexOf(filterId);
            if (filterIndex > -1) {
                avuRecord.extraFilters.splice(filterIndex, 1);
            }

            serveAvu.editAVU(avuRecord, avuId, callback);
        });
    });
}

module.exports = {
    addFilter: addFilter,
    removeFilter: removeFilter
};
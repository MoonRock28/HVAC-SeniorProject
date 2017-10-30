'use strict';
const serveFilter = require('../services/serveFilter');
const serveFS = require('../services/serveFS');

function addFilter(filter, FSId, callback) {
    // console.log('id is: ' + avuId);
    let type = filter.type;
    let newFilter = {
        width: filter.width,
        height: filter.height,
        depth: filter.depth,
        amount: filter.amount
    };

    serveFilter.newFilter(newFilter, (err, objectId) => {
        serveFS.getFS(FSId, (err, FSRecord) => {
            if (type === 'primary') {
                FSRecord.primaryFilters.push(objectId)
            } else if (type === 'secondary') {
                FSRecord.secondaryFilters.push(objectId)
            } else if (type === 'extra') {
                FSRecord.extraFilters.push(objectId)
            }
            serveFS.editFS(FSRecord, FSId, callback);
        });
    });
}

function removeFilter(filterId, FSId, callback) {
    serveFilter.deleteFilter(filterId, () => {
        serveFS.getFS(FSId, (err, FSRecord) => {
            let filterIndex = FSRecord.primaryFilters.indexOf(filterId);
            if (filterIndex > -1) {
                FSRecord.primaryFilters.splice(filterIndex, 1);
            }

            filterIndex = FSRecord.secondaryFilters.indexOf(filterId);
            if (filterIndex > -1) {
                FSRecord.secondaryFilters.splice(filterIndex, 1);
            }

            filterIndex = FSRecord.extraFilters.indexOf(filterId);
            if (filterIndex > -1) {
                FSRecord.extraFilters.splice(filterIndex, 1);
            }

            serveFS.editFS(FSRecord, FSId, callback);
        });
    });
}

module.exports = {
    addFilter: addFilter,
    removeFilter: removeFilter
};
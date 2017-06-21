'use strict';
const serveMap = require('../services/serveMap');
const serveBuilding = require('../services/serveBuilding');
const serveAvu = require('../services/serveAvu');
const serveFan = require('../services/serveFan');

function addMapToBuilding(map, buildingId, callback) {
    let newMap = {
        coordinates: map.coordinates,
        zoom: map.zoom
    };

    serveMap.newMap(newMap, (err, objectId) => {
        serveBuilding.getBuilding(buildingId, (err, buildingRecord) => {
            buildingRecord.googleMapSpot = objectId;
            serveBuilding.editBuilding(buildingRecord, buildingId, (err) => {
                callback(null, objectId);
            });
        });
    });
}

function addMapToAVU(map, avuId, callback) {
    let newMap = {
        coordinates: map.coordinates,
        zoom: map.zoom
    };

    serveMap.newMap(newMap, (err, objectId) => {
        serveAvu.getAVU(avuId, (err, avuRecord) => {
            avuRecord.googleMapSpot = objectId;
            serveAvu.editAVU(avuRecord, avuId, (err) => {
                callback(null, objectId);
            });
        });
    });
}

function addMapToFan(map, fanId, callback) {
    let newMap = {
        coordinates: map.coordinates,
        zoom: map.zoom
    };

    serveMap.newMap(newMap, (err, objectId) => {
        serveFan.getFan(fanId, (err, fanRecord) => {
            fanRecord.googleMapSpot = objectId;
            serveFan.editFan(fanRecord, fanId, (err) => {
                callback(null, objectId);
            });
        });
    });
}

module.exports = {
    addMapToAVU: addMapToAVU,
    addMapToBuilding: addMapToBuilding,
    addMapToFan: addMapToFan
};
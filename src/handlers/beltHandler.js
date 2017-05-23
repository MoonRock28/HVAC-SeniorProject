'use strict';
const serveBelt = require('../services/serveBelt');
const serveFan = require('../services/serveFan');

function addBelt(belt, fanId, callback) {
    // console.log('id is: ' + fanId);
    let list = belt.belt;
    let newBelt = {
        type: belt.type,
        amount: belt.amount
    };

    serveBelt.newBelt(newBelt, (err, objectId) => {
        serveFan.getFan(fanId, (err, fanRecord) => {
            if (list === 'belt') {
                fanRecord.belts.push(objectId);
            } else if (list === 'extra') {
                fanRecord.extraBelts.push(objectId);
            }
            serveFan.editFan(fanRecord, fanId, callback);
        });
    });
}

function removeBelt(beltId, fanId, callback) {
    serveBelt.deleteBelt(beltId, () => {
        serveFan.getFan(fanId, (err, fanRecord) => {
            let beltIndex = fanRecord.belts.indexOf(beltId);
            if (beltIndex > -1) {
                fanRecord.belts.splice(beltIndex, 1);
            }

            beltIndex = fanRecord.extraBelts.indexOf(beltId);
            if (beltIndex > -1) {
                fanRecord.extraBelts.splice(beltIndex, 1);
            }

            serveFan.editFan(fanRecord, fanId, callback);
        });
    });
}

module.exports = {
    addBelt: addBelt,
    removeBelt: removeBelt
};
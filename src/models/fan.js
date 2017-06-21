const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FanSchema = new Schema({
    name: String,
    coordinates: {lat: Number, lng: Number},
    buildingName: String,
    buildingId: String,
    floor: String,
    mechanicalRoom: String,
    fanSheave: String,
    motorSheave: String,
    belts: [{ type: Schema.Types.ObjectId, ref: 'Belt'}],
    extraBelts: [{ type: Schema.Types.ObjectId, ref: 'Belt'}],
    nextDateToCheck: Date,
    lastDateMaintained: Date,
    statusColor: String,
    additionalNotes: String
});

const Fan = mongoose.model('Fan', FanSchema);

module.exports = Fan;

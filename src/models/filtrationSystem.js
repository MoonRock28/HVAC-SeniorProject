const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FSSchema = new Schema({
    name: String,
    coordinates: {lat: Number, lng: Number},
    buildingName: String,
    buildingId: {type: Schema.Types.ObjectId, ref: 'Building'},
    floor: String,
    mechanicalRoom: String,
    primaryFilters: [{ type: Schema.Types.ObjectId, ref: 'Filter'}],
    secondaryFilters: [{ type: Schema.Types.ObjectId, ref: 'Filter'}],
    extraFilters: [{ type: Schema.Types.ObjectId, ref: 'Filter'}],
    nextDateToCheck: Date,
    lastDateMaintained: Date,
    statusColor: String,
    additionalNotes: String
});

const FS = mongoose.model('FS', FSSchema);

module.exports = FS;

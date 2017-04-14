const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AVUSchema = new Schema({
    name: String,
    location: { type: Schema.Types.ObjectId, ref: 'ItemLocation'},
    primaryFilters: [{ type: Schema.Types.ObjectId, ref: 'Filter'}],
    secondaryFilters: [{ type: Schema.Types.ObjectId, ref: 'Filter'}],
    extraFilters: [{ type: Schema.Types.ObjectId, ref: 'Filter'}],
    nextDateToCheck: Date,
    lastDateMaintained: Date,
    statusColor: String,
    additionalNotes: String
});

const AVU = mongoose.model('avu', AVUSchema);

module.exports = AVU;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema and Model

const BeltSchema = new Schema({
    type: String,
    amount: Number
});

const FilterSchema = new Schema({
    width: Number,
    height: Number,
    depth: Number,
    amount: Number
});

// const GoogleMapSchema = new Schema({
//    //whatever goes in here.
// });

const ItemLocationSchema = new Schema({
    floor: String,
    //googleMapSpot: GoogleMapSchema,
    mechanicalRoom: String
});

const FanSchema = new Schema({
    name: String,
    location: ItemLocationSchema,
    fanSheave: String,
    motorSheave: String,
    belts: [BeltSchema],
    extraBelts: [BeltSchema],
    nextDateToCheck: Date,
    lastDateMaintained: Date,
    statusColor: String,
    additionalNotes: String
});

const AVUSchema = new Schema({
    name: String,
    location: ItemLocationSchema,
    primaryFilters: FilterSchema,
    secondaryFilters: FilterSchema,
    extraFilters: FilterSchema,
    nextDateToCheck: Date,
    lastDateMaintained: Date,
    statusColor: String,
    additionalNotes: String
});

const BuildingSchema = new Schema({
    name: String,
    //googleMapSpot: GoogleMapSchema,
    AVUs: [AVUSchema],
    fans: [FanSchema],
    numBlack: Number,
    numRed: Number
});

const Building = mongoose.model('building', BuildingSchema);

module.exports = Building;
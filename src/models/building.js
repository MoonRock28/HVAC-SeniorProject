const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create Schema and Model
const BuildingSchema = new Schema({
    name: String,
    coordinates: {lat: Number, lng: Number},
    FSs: [{ type: Schema.Types.ObjectId,  ref: 'FS'}],
    fans: [{ type: Schema.Types.ObjectId,  ref: 'Fan'}],
    numBlack: Number,
    numRed: Number
});

const Building = mongoose.model('building', BuildingSchema);

module.exports = Building;

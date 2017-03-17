const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create Schema and Model
const BuildingSchema = new Schema({
    name: String,
    //googleMapSpot: {type: Schema.Types.ObjectId, ref: 'GoogleMap'},
    AVUs: [{ type: Schema.Types.ObjectId,  ref: 'AVU'}],
    fans: [{ type: Schema.Types.ObjectId,  ref: 'Fan'}],
    numBlack: Number,
    numRed: Number
});

const Building = mongoose.model('building', BuildingSchema);

module.exports = Building;

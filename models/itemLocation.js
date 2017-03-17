const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemLocationSchema = new Schema({
    floor: String,
    //googleMapSpot: {type: Schema.Types.ObjectId, ref: 'GoogleMap'},
    mechanicalRoom: String
});

const ItemLocation = mongoose.model('ItemLocation', ItemLocationSchema);

module.exports = ItemLocation;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoogleMapSchema = new Schema({
    coordinates: {lat: Number, lng: Number},
    zoom: Number
});

const GoogleMap = mongoose.model('googleMap', GoogleMapSchema);

module.exports = GoogleMap;

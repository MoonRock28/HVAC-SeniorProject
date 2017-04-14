const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoogleMapSchema = new Schema({
    //whatever goes in here.
});

const GoogleMap = mongoose.model('googleMap', GoogleMapSchema);

module.exports = GoogleMap;

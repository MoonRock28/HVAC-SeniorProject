const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema and Model
const homeSchema = new Schema({
    buildings: [{}],
    allAvus: [{}], //ordered by statusColor/lastDateMaintained
    allFans: [{}] //ordered by statusColor/lastDateMaintained
});

const Home = mongoose.model('home', homeSchema);

module.exports = Home;
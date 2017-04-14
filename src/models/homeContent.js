const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema and Model
const homeSchema = new Schema({
    buildings: [{ type: Schema.Types.ObjectId,  ref: 'Building'}],
    allAvus: [{ type: Schema.Types.ObjectId, ref: 'AVU'}], //ordered by statusColor/lastDateMaintained
    allFans: [{ type: Schema.Types.ObjectId, ref: 'Fan'}] //ordered by statusColor/lastDateMaintained
});

const Home = mongoose.model('home', homeSchema);

module.exports = Home;
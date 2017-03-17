const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BeltSchema = new Schema({
    type: String,
    amount: Number
});

const Belt = mongoose.model('belt', BeltSchema);

module.exports = Belt;

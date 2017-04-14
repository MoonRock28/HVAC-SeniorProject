const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FilterSchema = new Schema({
    width: Number,
    height: Number,
    depth: Number,
    amount: Number
});

const Filter = mongoose.model('filter', FilterSchema);

module.exports = Filter;

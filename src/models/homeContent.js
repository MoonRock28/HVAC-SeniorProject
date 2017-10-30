const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema and Model
const homeSchema = new Schema({
    buildings: [{type: Schema.Types.ObjectId, ref: 'Building'}],
    allFSs: [{type: Schema.Types.ObjectId, ref: 'FS'}], //ordered by statusColor/lastDateMaintained
    allFans: [{type: Schema.Types.ObjectId, ref: 'Fan'}], //ordered by statusColor/lastDateMaintained
    colorCheckDate: Date
});

homeSchema.statics.findOneOrCreate = function(condition, doc, callback) {
    const self = this;
    self.findOne(condition, (err, result) => {
        return result
            ? callback(err, result)
            : self.create(doc, (err, result) => {
                return callback(err, result);
            });
    });
};

const Home = mongoose.model('home', homeSchema);

module.exports = Home;
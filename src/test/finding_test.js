const chai = require('chai');
const Building = require('../models/building');

//describe tests
describe('Finding records ', () => {
  var Hart;
  beforeEach( (done) => {
      Hart = new Building({
      name: 'Hart',
      numBlack: 3,
      numRed: 4
    });

    Hart.save().then( () => {
      chai.assert(Hart.isNew === false);
      done();
    });
  });

    //create tests
    it('Finds one record from the database', (done) => {
      Building.findOne({name: 'Hart'}).then( (record) => {
        chai.assert(record.name === 'Hart');
        done();
      });

    });
    // next test
    it('Finds one record from the database by _id', (done) => {
      Building.findOne({_id: Hart._id}).then( (record) => {
        chai.assert(record._id.toString() === Hart._id.toString());
        done();
      });
    });
});

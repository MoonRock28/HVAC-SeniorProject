const chai = require('chai');
const Building = require('../models/building');

//describe tests
describe('Deleting records ', () => {
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
    it('Deletes one record from the database', (done) => {
      Building.findOneAndRemove({name: 'Hart'}).then( () => {
        Building.findOne({name: 'Hart'}).then( (result) => {
          chai.assert(result === null);
          done();
        });
      });


    });
    // next test

});

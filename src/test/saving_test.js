const chai = require('chai');
const Building = require('../models/building');
const Fan = require('../models/fan');
const Belt = require('../models/belt');
const FS = require('../models/filtrationSystem');
const Filter = require('../models/filter');
const mongoose = require('mongoose');

//describe tests
describe('Saving records ', function () {
    beforeEach( (done) => {
      mongoose.connection.collections.FSs.drop( () => {
        mongoose.connection.collections.filters.drop( () => {
          done();
        });
      });
    });

    //create tests
    it('Save a record to the database', (done) => {
      let Hart = new Building({
        name: 'Hart',
        //FSs: [{ name: 'AHU 1', statusColor: 'green', additionalNotes: 'This is the first item.'}],
        numBlack: 3,
        numRed: 4
      });

      Hart.save().then( () => {
        chai.assert(Hart.isNew === false);
        done();
      });
    });
    //next test

    it('Add a Filtration System to the building', (done) => {
      let FS2 = new FS({
        name: 'AHU 2',
        statusColor: 'yellow',
        additionalNotes: 'second item'
      });
      let taylor = new Building({
        name: 'Taylor',
        FSs: [FS2.ObjectId],
        numBlack: 3,
        numRed: 5
      });
      FS2.save();
      let myFS = new FS({
          name: 'AHU 1',
          statusColor: 'green',
          additionalNotes: 'first AVU in list'
      });

      taylor.save().then( () => {
        Building.findOne({name: 'Taylor'}).then( (record) => {
          record.FSs.push(myFS.ObjectId);
          myFS.save();
          record.save().then( () => {
            Building.findOne({name: 'Taylor'}).then( (result) => {
              //console.log(result.FSs.length);
              chai.assert(result.FSs.length === 2);
              done();
            });
          });
        });
      });
    });

    it('Add a Fan to the building', (done) => {
      let fan1 = new Fan({
        name: 'weirdFan',
        statusColor: 'blue',
        additionalNotes: 'first fan'
      });
      let taylor = new Building({
        name: 'Taylor',
        fans: [fan1],
        numBlack: 3,
        numRed: 5
      });
      fan1.save();
      let fan2 = new Fan({name: 'funnyFan', statusColor: 'green', additionalNotes: 'second fan'});

      taylor.save().then( () => {
        Building.findOne({name: 'Taylor'}).then( (record) => {
          record.fans.push(fan2);
          fan2.save();
          record.save().then( () => {
            Building.findOne({name: 'Taylor'}).then( (result) => {
              //console.log(result.FSs.length);
              chai.assert(result.fans.length === 2);
              done();
            });
          });
        });
      });
    });

    it('Add a filter to a Filtration System', (done) => {
      let pFilter = new Filter({
        width: 20,
        height: 24,
        depth: 2,
        amount: 12
      });
      let sFilter = new Filter({
        width: 20,
        height: 24,
        depth: 12,
        amount: 12
      });
      let thisFS = new FS({
        name: 'AHU 3',
        primaryFilters: [pFilter],
        secondaryFilters: [sFilter],
        statusColor: 'red',
        additionalNotes: 'random'
      });
      pFilter.save();
      sFilter.save();

      thisFS.save().then( () => {
        FS.findOne({name: 'AHU 3'}).then( (record) => {
          let newPFilter = new Filter({width: 12, height: 24, depth: 2, amount: 6});
          let newSFilter = new Filter({width: 12, height: 24, depth: 8, amount: 6});
          record.primaryFilters.push(newPFilter);
          record.secondaryFilters.push(newSFilter);
          newPFilter.save();
          newSFilter.save();
          record.save().then( () => {
            FS.findOne({name: 'AHU 3'}).then( (result) => {
              chai.assert((result.primaryFilters.length === 2) && (result.secondaryFilters.length === 2));
              done();
            });
          });
        });
      });
    });

    it('Add a belt to a fan', (done) => {
      let belt = new Belt({
        type: 'VL245',
        amount: 3
      });
      let myFan = new Fan({
        name: 'Fab-05',
        belts: [belt],
        fanSheave: 'Ah3-vp',
        motorSheave: 'something',
        statusColor: 'orange',
      });

      belt.save();
      myFan.save().then( () => {
        Fan.findOne({name: 'Fab-05'}).then( (record) => {
          let newBelt = new Belt({ type: 'VL245', amount: 1});
          record.extraBelts.push(newBelt);
          newBelt.save();
          record.save().then( () => {
            Fan.findOne({name: 'Fab-05'}).then ( (result) => {
              chai.assert(result.extraBelts.length === 1);
              done();
            });
          });
        });
      });

    }); 
});

const mongoose = require('mongoose');

//es6 promise library
mongoose.Promise = global.Promise;

//connect to the database before tests
before( (done) => {
  //connect to mongoDB
  mongoose.connect('mongodb://localhost/HVAC-TEST');

  mongoose.connection.once('open', () => {
    console.log('connection has been established...');
    mongoose.connection.collections.fans.drop( () => {
      mongoose.connection.collections.belts.drop( () => {
        done();
      });
    });
  }).on('error', (err) => {
    console.log('Connection Error: ' + err);
  });

});

//drop the collections before each test
beforeEach( (done) => {
  //drop the collections
  mongoose.connection.collections.buildings.drop( () => {
    done();
  });

});

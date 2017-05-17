const chai = require('chai');
const color = require('../services/serveColor');
const day1 = 86400000;
const day7 = 604800000;
const day14 = 1209600000;
const day28 = 2419200000;
const today = new Date().getTime();

describe('Testing getStatusColor', () => {
    it('should return with black', (done) => {
        // console.log('today ' + today);
        // console.log('yesterday ' + (today - day1));
        let black = color.getStatusColor(today - day1, today - day28);
        chai.assert(black === 'black');
        done();
    });

    it('should return with red', (done) => {
        // console.log('6 days ' + (today + day7 - day1));
        let red = color.getStatusColor(today + day7 - day1, today - day28);
        // console.log(red);
        chai.assert(red === 'red');
        done();
    });

    it('should return with orange', (done) => {
        let orange = color.getStatusColor(today + day14 - day1, today - day28);
        chai.assert(orange === 'orange');
        done();
    });

    it('should return with yellow', (done) => {
        let yellow = color.getStatusColor(today + day28 - day1, today - day28);
        chai.assert(yellow === 'yellow');
        done();
    });

    it('should return with green', (done) => {
        let green = color.getStatusColor(today + day28 + day7, today - day28);
        chai.assert(green === 'green');
        done();
    });

    it('should return with blue', (done) => {
        let blue = color.getStatusColor(today + day28 + day7, today - day1);
        chai.assert(blue === 'blue');
        done();
    });
});
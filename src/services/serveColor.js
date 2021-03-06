'use strict';

function getStatusColor(nextDateToCheck, lastDateMaintained) {
    let today = new Date().getTime();
    let next = new Date(nextDateToCheck).getTime();
    let last = new Date(lastDateMaintained).getTime();
    // console.log(today);
    // console.log(next);
    // console.log(last);

    if ((next - today) <= 0) {
        return "black";
    } else if ((next - today) <= 604800000) { // 7 days in milliseconds
        return "red";
    } else if ((next - today) <= 1209600000) { // 14 days
        return "orange";
    } else if ((next - today) <= 2419200000) { // 28 days
        return "yellow";
    } else {
        if ((today - last) < 604800000) {
            return "blue";
        } else {
            return "green";
        }
    }
}

module.exports = {
    getStatusColor: getStatusColor
};
'use strict';

function getStatusColor(nextDateToMaintain, lastDateMaintained) {
    let today = new Date().getMilliseconds();
    let next = new Date(nextDateToMaintain).getMilliseconds();
    let last = new Date(lastDateMaintained).getMilliseconds();

    if (next - today <= 0) {
        return "black";
    } else if (next - today <= 604800000) { // 7 days in milliseconds
        return "red";
    } else if (next - today <= 1209600000) { // 14 days
        return "orange";
    } else if (next - today <= 2419200000) { // 28 days
        return "yellow";
    } else {
        if (today - last < 604800000) {
            return "blue";
        } else {
            return "green";
        }
    }
}

module.exports = {
    getStatusColor: getStatusColor
};
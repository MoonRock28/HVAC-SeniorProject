'use strict';
const mongoose = require(mongoose);
const User = require('../models/user');

function newUser(user, callback) {
    let thisUser = new User({
        username: user.username,
        password: user.password,
    });

    thisUser.save().then( () => {
        callback(null, thisUser._id)
    });
}

function getUser(user, callback) {
    User.findOne({username: user.username, password: user.password}).then( (record) => {
        callback(null, record);
    });
}

function editUser(user, objectId, callback) {
    user.findOne({_id: objectId}).then( (record) => {
        record.username = user.username;
        record.password = user.password;

        record.save().then( () => {
            callback(null, objectId);
        });
    });
}

function deleteUser(objectId, callback) {
    user.findOneAndRemove({_id: objectId}).then( () => {
        callback(null);
    });
}

module.exports = {
    newUser: newUser,
    getUser: getUser,
    editUser: editUser,
    deleteUser: deleteUser
};
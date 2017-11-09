const User = require('../models/user');

exports.findID = function(id, cb) {
    //console.log('Middlware');

    User.findById(id, function(err, user){
        if(err) {
            cb(err, null);
        }
        if(!user) {
            cb(null, null);
        }
        cb(null, user);
    });
};

exports.saves = function (id, param, data, cb) {
    User.findById(id, (err, user) => {
        "use strict";
        if(err) cb(err, null);
        if(!user) cb(null, null);
        user[param] = data;
        user.save((err)=>{
            if(err) cb(err, user);
            cb(null, user);
        });
    })
};

//module.exports = loadUser;
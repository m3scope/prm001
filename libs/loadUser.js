const User = require('../models/user');
const Curr = ['','rezPzm','rezUsd','rezRur'];
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

exports.saves = function (id, param, data, dt, cb) {
    User.findById(id, (err, user) => {
        "use strict";
        if(err) cb(err, null);
        if(!user) cb(null, null);
        user[Curr[dt]] = user[Curr[dt]]*1 + data*1;
        user[param] = user[param]*1 - data*1;
        user.save((err)=>{
            if(err) cb(err, user);
            cb(null, user);
        });
    })
};

//module.exports = loadUser;
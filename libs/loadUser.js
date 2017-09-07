const User = require('../models/user');

let loadUser = function(id, cb) {
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

module.exports = loadUser;
const User = require('../models/user');

let loadUser = function(id) {
    //console.log('Middlware');

    User.findById(id, function(err, user){
        if(err) {
            return null
        }
        if(!user) {
            return null
        }
        return user;
    });
};

module.exports = loadUser;
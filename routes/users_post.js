/**
 * Created by freez on 15.06.2017.
 */
var UserModel = require('../db/models/user');

var rnd = random(1000);
var newUser = new UserModel({
    catagory: 'amd',
    name_f: 'name'+String(rnd),
    email: 'email'+ String(rnd) +'@gmail.com'
});

//newUser.dudify()

var users_post = function(req, res, next) {
    console.log('Middlware');
    console.log(dbConfig.uri);
    newUser.save(function (err) {
        if(err) throw err;
        console.log('User created!!!');
        req.name_f = newUser.name_f;
    });
    next();
};

module.exports = users_post;
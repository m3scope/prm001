/**
 * Created by freez on 15.06.2017.
 */
const UserModel = require('../models/user');

let rnd = Math.round(Math.random() * 1000);
const newUser = new UserModel({
    catagory: 'amd',
    name_f: 'name' + String(rnd),
    email: 'email' + String(rnd) + '@gmail.com',
    password: '1234567890'
});

//newUser.dudify()

let users_post = function (req, res, next) {
    console.log('Middlware');
    //console.log(dbConfig.uri);
    newUser.save(function (err) {
        if (err) throw err;
        console.log('User created!!!');
        req.name_f = newUser.name_f;
    });

    next();
};

module.exports = users_post;
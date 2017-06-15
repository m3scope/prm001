/**
 * Created by freez on 15.06.2017.
 */
var mongoose = require('mongoose');

var config = require('config');

var dbConfig = config.get('dbConfig');
var UserModel = require('../db/models/user');


var db = mongoose.connect(dbConfig.uri);    //, dbConfig.options);
db.connection.on('error', console.error.bind(console, 'connection error:'));
db.connection.once('open', function () {
    console.log('Running DB');
});

var rnd = random(1000);
var newUser = new UserModel({
    catagory: 'amd',
    email: 'email'+ rnd +'@gmail.com'
});

var users_post = function(req, res, next) {
    console.log('Middlware');
    console.log(dbConfig.uri);
    if (true){
        req.user = 'user fking shits';
        next();
    } else {
        next(new Error('Failed to load user'));
    }
    //res.status(500);
    //res.render('error', {message: 'USERS Error!'});
    //next();
};

module.exports = users_post;
/**
 * Created by freez on 01.06.2017.
 */
var mongoose = require('../libs/mongoose');

var authLK = function(req, res, next) {
    console.log('Middlware');
    console.log(dbConfig.uri);
    if (false){
        req.Authorized = true;
        next();
    } else {
        req.Authorized = false;
        next();
        //next(new Error('Failed to load user'));
    }
    //res.status(500);
    //res.render('error', {message: 'USERS Error!'});
    //next();
};

module.exports = authLK;

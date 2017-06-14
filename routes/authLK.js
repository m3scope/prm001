/**
 * Created by freez on 01.06.2017.
 */
var mongoose = require('mongoose');

var config = require('config');

var dbConfig = config.get('dbConfig');

var db = mongoose.connect(dbConfig.uri, dbConfig.options);
db.connection.on('error', console.error.bind(console, 'connection error:'));
db.connection.once('open', function () {
    console.log('Running DB');
    //Schemas
    /*var Book = new mongoose.Schema({
        title: String,
        author: String,
        releaseDate: Date
    });

    //Models
    var BookModel = mongoose.model('Book', Book);
    */
});

var authLK = function(req, res, next) {
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

module.exports = authLK;

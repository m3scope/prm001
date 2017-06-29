/**
 * Created by freez on 29.06.2017.
 */

var MongoClient = require('mongodb').MongoClient;
var config = require('config');

var dbConfig = config.get('dbConfig');

MongoClient.connect(dbConfig.uri, function(err, db){
    if (err) return console.log(err);
});

module.exports = MongoClient;
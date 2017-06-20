/**
 * Created by freez on 20.06.2017.
 */
var mongoose = require('mongoose');
var config = require('config');

var dbConfig = config.get('dbConfig');

mongoose.connect(dbConfig.uri);    //, dbConfig.options);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
 //db.connection.once('open', function () {
// console.log('running db');
 //});

module.exports = mongoose;
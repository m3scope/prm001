/**
 * Created by freez on 20.06.2017.
 */
var mongoose = require('mongoose');
var config = require('config');

var dbConfig = config.get('dbConfig');

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true);  // Просим Mongoose писать все запросы к базе в консоль. Удобно для отладки кода

mongoose.connect(dbConfig.uri);    //, dbConfig.options);
console.log(dbConfig.uri);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
 //db.connection.once('open', function () {
// console.log('running db');
 //});

module.exports = mongoose;
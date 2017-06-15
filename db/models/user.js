/**
 * Created by freez on 09.06.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema   = new Schema({
    catagory: String,
    createDate: { type: Date, default: Date.now },
    email: String
});

module.exports = mongoose.model('User', UserSchema);
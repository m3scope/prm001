/**
 * Created by freez on 09.06.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema   = new Schema({
    catagory: String,
    name_f: String,
    create_at: { type: Date, default: Date.now },
    update_at: Date,
    email: String
});

module.exports = mongoose.model('User', UserSchema);
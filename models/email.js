/**
 * E-mail schema
 */

const mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


//***************************************
const schema = new Schema({
    created: {type: Date, default: Date.now},
    user_id: {type: ObjectId, ref: 'User'},
    email_address: {type: String},
    text: {type: String, default: null},
    token: {type: String, default: null},
    operationId: {type: ObjectId, default: null},
    operation_class: {type:Number, default: 0}

}, {
    timestamps: true
});

exports.Email = mongoose.model('Email', schema);
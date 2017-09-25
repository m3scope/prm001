/*
*****************************
//
//      СДЕЛКА, используетя в работе биржи
//      Создается пользователем (биржа)
//
****************************
 */
const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const dealSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего транзакцию
    bayerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }      // Id покупателя
}, {
    timestamps: true
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
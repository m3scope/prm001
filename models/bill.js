/*
*****************************
//
//      СЧЕТ, выставляется для оплаты пользователю
//      Создается на основании СДЕЛКИ (deal, биржа)
//
****************************
 */

const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const billSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего транзакцию
    bayerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }      // Id покупателя
}, {
    timestamps: true
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
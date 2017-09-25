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
    dealId: { type: mongoose.Schema.ObjectId, ref: 'Deal', required: false },       // ID сделки (deal), используется в работе биржи
    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего транзакцию (продавца)
    bayerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },      // Id пользователя покупателя
    deal_cost: {type: Number, default: 0},      // количество продаваемой валюты
    deal_currency: {type: Number, default: 0},  // ИД (число код) валюты продажи
    pay_cost: {type: Number, default: 0},       // сумма оплаты без комиссии
    pay_currency: {type: Number, default: 0},   // ИД (число код) валюты покупки
    commission: {type: Number, default: 0}      // Сумма комиссии (~5-7%)
},  {
    timestamps: true
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
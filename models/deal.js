/*
*****************************
//
//      СДЕЛКА, используетя в работе биржи
//      Создается пользователем (биржа)
//      Коды валют (101 - Prizm, 102 - Gold, 103 - Silver)
//
****************************
 */
const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const dealSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего сделку
    deal_amount: {type: Number, default: 0},      // количество продаваемой валюты
    deal_currency: {type: Number, default: 0},  // Код (число) валюты продажи ()
    price_amount: {type: Number, default: 0},       // цена без комиссии
    price_currency: {type: Number, default: 0},   // Код (число) валюты покупки
    commission: {type: Number, default: 0},     // Сумма комиссии (~5-7%)
    status: {type: Number, default: 0},          // Статус сделки (активный, отменен, закрыт)
    bills: [
        {
            billId: { type: mongoose.Schema.ObjectId, ref: 'Bill', required: true }       // ID счета (bill), основание для транзакции
        }
    ]
}, {
    timestamps: true
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
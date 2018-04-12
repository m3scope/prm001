/*
*****************************
//
//      СДЕЛКА, используетя в работе биржи
//      Создается пользователем (биржа)
//      Коды валют (1 - Prizm, 2 - Gold, 3 - Silver) ['', 'Prizm', 'Gold', 'Silver']
//
****************************
 */
const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const dealSchema = new mongoose.Schema({
    UID: {type: String, default: ''},
    operation_cod: {type: Number, default: 2},
    operation_name: {type: String, default: 'Deal'},
    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего сделку

    deal_amount: {type: Number, default: 0},      // количество продаваемой/покупаемой валюты
    deal_amount_bill: {type: Number, default: 0},      // количество остаток валюты
    deal_currency: {type: Number, default: 0},  // Код (число) валюты продажи/покупки

    price_amount: {type: Number, default: 0},       // цена без комиссии
    price_currency: {type: Number, default: 0},   // Код (число) валюты покупки/продажи

    summ: {type: Number, default: 0},
    summ_bill: {type:Number, default: 0},

    price: {type: Number, default: 0},          // Цена продажи с комиссией
    price1: {type: Number, default: 0},         // Цена покупки

    commission_tax: {type: Number, default: 0},     // процент комиссии (~0,005-0,007)
    commission: {type: Number, default: 0},     // Цена комиссии (~5-7%)
    commission_summ: {type: Number, default: 0},     // Сумма комиссии (~5-7%)

    class: {type: Number, default: 0},          // Тип(класс) сделки (0 - продажа, 1 - покупка)
    status: {type: Number, default: 0},          // Статус сделки (0 - создан, 1 - активный, 3 - отменен, 9 - закрыт (исполнен))
    bills: [
        {
            billId: { type: mongoose.Schema.ObjectId, ref: 'Bill', required: true }       // ID счета (bill), основание для транзакции
        }
    ]
}, {
    timestamps: true
});

dealSchema.virtual('_price')
    .get(function () {
        return this.price_amount + commission;
    });

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
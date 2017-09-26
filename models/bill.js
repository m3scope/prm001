/*
*****************************
//
//      СЧЕТ, выставляется для оплаты пользователю
//      Создается на основании СДЕЛКИ (deal, биржа)
//      Является основанием для создания транзакции (5 шт)
//      1. списание проданной валюты у продавца
//      2. зачисление оплаты продавцу
//      3. списание оплаты у покупателя
//      4. зачисление продавцу купленной валюты
//      5. зачисление комиссии сервису в валюте оплаты покупки
//
//      6. Пополнение баланса
//      7. Вывод средств
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
    deal_amount: {type: Number, default: 0},      // количество продаваемой валюты
    deal_currency: {type: Number, default: 0},  // Код (число) валюты продажи
    pay_amount: {type: Number, default: 0},       // сумма оплаты без комиссии
    pay_currency: {type: Number, default: 0},   // Код (число) валюты покупки
    commission: {type: Number, default: 0},     // Сумма комиссии (~5-7%)
    status: {type: Number, default: 0}          // Статус счета ()
},  {
    timestamps: true
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
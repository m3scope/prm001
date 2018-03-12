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
    UID: {type: String, default: Date.now().toString()},
    dealGeneralId: { type: mongoose.Schema.ObjectId, ref: 'Deal', required: false },       // ID сделки (deal), используется в работе биржи
    dealTwoId: { type: mongoose.Schema.ObjectId, ref: 'Deal', required: false },       // ID сделки (deal), используется в работе биржи

    dealerGeneralId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего транзакцию (продавца)
    dealerTwoId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },      // Id пользователя покупателя

    deal_amount: {type: Number, default: 0},      // количество продаваемой валюты
    deal_currency: {type: Number, default: 0},  // Код (число) валюты продажи

    price_amount: {type: Number, default: 0},       // цена без комиссии
    price_currency: {type: Number, default: 0},   // Код (число) валюты покупки

    summ: {type: Number, default: 0},

    saldo_price: {type: Number, default: 0},          // разница цен
    saldo_summ: {type: Number, default: 0},          // разница сумма

    commission_tax: {type: Number, default: 0},     // Сумма комиссии (~5-7%)
    commission_summ: {type: Number, default: 0},     // Сумма комиссии (~5-7%)

    class: {type: Number, default: 0},          // Тип(класс) сделки (0 - продажа, 1 - покупка)

    viewStatus: {type: Number, default: 0},     // статус просмотра
    status: {type: Number, default: 2}          // Статус счета (активный(ожидает подтверждения), отменен, закрыт(исполнен))
},  {
    timestamps: true
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
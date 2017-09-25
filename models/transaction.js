/*
*****************************
//
//      ТРАНЗАКЦИЯ, используется для учета всех движений, учета комиссии и т.п.
//      Создается на основании СЧЕТа (bill)(5 шт)
//      1. списание проданной валюты у продавца
//      2. зачисление оплаты продавцу
//      3. списание оплаты у покупателя
//      4. зачисление продавцу купленной валюты
//      5. зачисление комиссии сервису в валюте оплаты покупки
//
****************************
 */

const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const transactionSchema = new mongoose.Schema({
    billId: { type: mongoose.Schema.ObjectId, ref: 'Bill', required: true },       // ID счета (bill), основание для транзакции
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего транзакцию
    accountId: { type: mongoose.Schema.ObjectId, ref: 'Account', required: true },      // Id покупателя
    currency: {type: Number, default: 0},       // Код (число) валюты
    cost: {type: Number, default: 0},           // Количество валюты
    up_down: {type: Boolean, default: false},   // Вид движения, пополнение(true), списание(false)
    sort: {type: Number, default: 1}            // Вид транзакции (см. выше)
},  {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
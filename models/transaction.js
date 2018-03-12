/*
*****************************
//
//      ТРАНЗАКЦИЯ, используется для учета всех движений, учета комиссии и т.п.
//      Создается на основании СЧЕТа (bill)(5 шт)
//      1. зачисление/списание проданной/купленной валюты
//      2. зачисление/списание оплаты
//      3. списание комиссии в валюте оплаты
//      4. зачисление комиссии сервису в валюте оплаты
//
//      6. пополнение баланса пользователя
//      7. вывод с баланса пользователя
//
//      9. зачисление сервису суммы разницы по цене
//
****************************
 */

const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const transactionSchema = new mongoose.Schema({
    UID: {type: String, default: Date.now().toString()},
    billId: { type: mongoose.Schema.ObjectId, ref: 'Bill', required: true },       // ID счета (bill), основание для транзакции
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего транзакцию
    //accountId: { type: mongoose.Schema.ObjectId, ref: 'Account', required: true },      // Id покупателя
    currency: {type: Number, default: 0},       // Код (число) валюты
    amount: {type: Number, default: 0},           // Количество валюты
    up_down: {type: Boolean, default: false},   // Вид движения, пополнение(true), списание(false)
    sort: {type: Number, default: 1},            // Вид транзакции (см. выше)
    sortName: {type: String, default: 'none'}
},  {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const bankSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User'},     // Id пользователя владелец кошелька
    bank_id: {type: Number, default: 0},        // числовой код
    bank_name: String,                      // Наименование "банка"
    bank_number: String,            // номер счета (кошелька)
    currency: {type: Number, default: 0},  // Код (число) валюты
    currency_name: String,                  // Наименование валюты
    summ_transactions: {type: Number, default: 190000},       // сумма дневных транзакций
    summ_all: {type:Number, default: 50000},                // сумма хранения
    summ_trans_current: {type: Number, default: 0},       // сумма дневных транзакций текущая
    summ_all_current: {type:Number, default: 0},                // сумма хранения текущая
}, {
    timestamps: true
});



const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
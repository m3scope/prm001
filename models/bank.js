const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const bankSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User'},     // Id пользователя владелец кошелька

    bank_id: {type: Number, default: 0},        // числовой код (0 - PRIZM, 1 - QIWI, 2 - Yandex, 3 - PerfectMoney)
    bank_name: String,                      // Наименование "банка" ['PRIZM','QIWI','Yandex','PerfectMoney']
    bank_number: String,            // номер счета (кошелька)
    bank_publicKey: String,         // для Призм

    currency: {type: Number, default: 0},  // Код (число) валюты (1 - PZM, 2 - USD, 3 - RUR)
    currency_name: String,                  // Наименование валюты ['','PZM','USD','RUR']

    summ_transactions: {type: Number, default: 190000},       // сумма дневных транзакций
    summ_all: {type:Number, default: 50000},                // сумма хранения

    summ_trans_current: {type: Number, default: 0},       // сумма дневных транзакций текущая
    summ_all_current: {type:Number, default: 0},                // сумма хранения текущая

    summ_rez: {type: Number, default: 0},

    query_in: [
        {
            query_id:{ type: mongoose.Schema.ObjectId, ref: 'Query', required: true }
        }
    ],

    query_out: [
        {
            query_id:{ type: mongoose.Schema.ObjectId, ref: 'Query', required: true }
        }
    ]

}, {
    timestamps: true
});



const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
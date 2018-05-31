const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.
//const User = require('./user');

const reg_bankSchema = new mongoose.Schema({
    UID: {type: String, default: ''},

    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User'},     // Id пользователя владелец кошелька

    rounds: {type: Number, default: 0},     // позиция в очереди

    bank_cod: {type: Number, default: 99},        // числовой код (0 - PRIZM, 1 - QIWI, 2 - Yandex, 3 - SberBank, 4 - ADVcash, 5 - PerfectMoney, 6 - NixMoney, 7 - PayPal)
    bank_name: {type:String, default:''},                      // Наименование "банка" ['PRIZM','QIWI','Yandex','SberBank','ADVcash','PerfectMoney','NixMoney','PayPal']
    bank_number: {type:String, default:''},            // номер счета (кошелька)
    bank_publicKey: {type:String, default:''},         // для Призм
    bank_username:{type: String, default: ''},

    date_in: {type: Date, default: Date.now},       // прием средств до даты (дата окончания приема средств)
    date_out: {type: Date, default: Date.now},      // отправка средств до даты (дата окончания отправки средств)

    currency: {type: Number, default: 0},  // Код (число) валюты (1 - PZM, 2 - USD, 3 - RUR)
    currency_name: {type:String, default:''},                  // Наименование валюты ['','PZM','USD','RUR']

    summ_transactions: {type: Number, default: 190000},       // сумма дневных транзакций
    summ_all: {type:Number, default: 50000},                // максимальная сумма хранения

    summ_trans_current: {type: Number, default: 190000},       // сумма дневных транзакций текущая
    summ_all_current: {type:Number, default: 0},                // сумма хранения текущая

    summ_trans_day: {type: Number, default: 0},       // сумма дневных транзакций текущая
    summ_all_day: {type:Number, default: 0},

    summ_trans_month: {type: Number, default: 0},       // сумма дневных транзакций текущая
    summ_all_month: {type:Number, default: 0},

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



const regBank = mongoose.model('regBank', reg_bankSchema);

module.exports = regBank;
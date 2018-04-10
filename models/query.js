const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const  querySchema = new mongoose.Schema({
    UID: {type: String, default: null},
    operation_cod: {type: Number, default: 1},
    operation_name: {type: String, default: 'Query'},
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего Запрос
    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User' },                // Id пользователя исполнителя Запрос
    bankId: { type: mongoose.Schema.ObjectId, ref: 'Bank' },

    key_Hash: {type: String},
    key_Salt: {type: String},
    datas: {type: String},      // данные для запроса

    bank_cod: Number,               // cod
    bank_name: String,
    bank_number: String,        // number
    bank_publicKey: {type: String, default:'0'},

    amount: Number,
    commission_tax: {type: Number, default: 0},
    commission_summ: Number,

    currency: Number,
    currency_name: String,

    action: String,     // Строка действий после поддтверждения запроса
    info: String,       // Информация, хз какая...
    comment: String,    // Комментарий
    cod: String,

    dataCancel: {type: Date}, // _Удалить...
    dateCancel: {type: Date, default: null},    // Дата отмены запроса

    dateExec: {type: Date, default: null},    // Дата подтверждения/исполнения запроса

    comments: {type:String, default:''},
    status: {type: Number, default: 0},     // ['создана','подтверждена (ожидание исполнения)','исполнена(закрыта)','отменена','отмена АДМ']

    class: {type: Number, default: 0},  // Тип(класс) сделки (1 - Ввод средств, 0 - Вывод средств)

    sort: {type: Number, default: 0},
    views: {type: Number, default: 0}
}, {
    timestamps: true
});


querySchema.methods.encryptKey = function (data) {
    return crypto.pbkdf2Sync(data, this.key_Salt, 1, 128, 'sha1');
};

querySchema.methods.checkData = function(data){
    //if (!password) return false;
    //if (!this.passwordHash) return false;
    return this.encryptKey(data) == this.key_Hash;
};

querySchema.virtual('data')
    .set(function (data) {
        if(data){
            this.datas = JSON.stringify(data);
            this.key_Salt = crypto.randomBytes(128).toString('base64');
            this.key_Hash = this.encryptKey(JSON.stringify(data));
        } else {
            this.key_Salt = undefined;
            this.key_Hash = undefined;
        }
    });


const Query = mongoose.model('Query', querySchema);
module.exports = Query;
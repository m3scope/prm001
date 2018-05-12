const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const  querySchema = new mongoose.Schema({
    UID: {type: String, default: null},
    operation_cod: {type: Number, default: 1},
    operation_name: {type: String, default: 'Query'},
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего Запрос

    dealerId: { type: mongoose.Schema.ObjectId, ref: 'User' },                // Id пользователя исполнителя Запрос
    bankId: { type: mongoose.Schema.ObjectId, ref: 'Bank' },        // Id  банка исполнителя Запрос
    dealer_bank_username:{type: String, default:''},
    dealer_bank_name:{type: String, default:''},
    dealer_bank_number:{type: String, default:''},

    key_Hash: {type: String, default:''},
    key_Salt: {type: String, default:''},
    datas: {type: String, default:''},   // данные для запроса

    bank_cod: {type: Number, default: 0},               // cod
    bank_name: {type: String, default:''},
    bank_number: {type: String, default:''},        // number
    bank_publicKey: {type: String, default:'0'},

    amount: {type: Number, default: 0},
    commission_tax: {type: Number, default: 0},
    commission_summ: {type: Number, default: 0},

    bank_commission_tax: {type: Number, default: 0},
    bank_commission_summ: {type: Number, default: 0},

    currency: {type: Number, default: 1},
    currency_name: {type: String, default:''},

    action: {type: String, default:''},    // Строка действий после поддтверждения запроса
    info: {type: String, default:''},       // Информация, хз какая...
    comment: {type: String, default:''},    // Комментарий
    cod: {type: String, default:''},
    qrCode: {type: String, default: ''},

    dataCancel: {type: Date}, // _Удалить...
    dateCancel: {type: Date, default: null},    // Дата отмены запроса

    dateExec: {type: Date, default: null},    // Дата подтверждения/исполнения запроса

    comments: {type:String, default:''},    // Комментарии Администраторов
    status: {type: Number, default: 0},     // ['создана','подтверждена','','исполнена(закрыта)','отменена','отмена АДМ']

    class: {type: Number, default: 0},  // Тип(класс) сделки (1 - Ввод средств, 0 - Вывод средств)

    sort: {type: Number, default: 0},   // ['обычная','служебная']
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
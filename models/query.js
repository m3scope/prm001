const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const  querySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего Запрос
    key_Hash: {type: String},
    key_Salt: {type: String},
    datas: {type: String},      // данные для запроса
    bank: String,               // name
    bank_number: String,        // number
    amount: Number,
    commission_summ: Number,
    action: String,     // Строка действий после поддтверждения запроса
    info: String,
    comment: String,
    cod: String,
    status: {type: Number, default: 0},     // 0 - создана, 1 - подтверждена (ожидание исполнения), 3 - исполнена(закрыта), 4 - отменена
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
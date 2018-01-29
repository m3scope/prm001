const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const  querySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего Запрос
    key_Hash: {type: String},
    key_Salt: {type: String},
    data: {type: String},       // данные для запроса
    action: String,     // Строка действий после поддтверждения запроса
    status: {type: Number, default: 0},
    sort: {type: Number, default: 0}
});

querySchema.methods.encryptKey = function () {
    return crypto.pbkdf2Sync(this.data, this.key_Salt, 1, 16, 'sha1');
};
querySchema.methods.checkData = function(data){
    //if (!password) return false;
    //if (!this.passwordHash) return false;
    return this.encryptKey(data) == this.key_Hash;
};

querySchema.virtual('datas')
    .set(function (data) {
        if(data){
            this.data = data;
            this.key_Salt = crypto.randomBytes(16).toString('base64');
            this.key_Hash = this.encryptKey(data);
        } else {
            this.key_Salt = undefined;
            this.key_Hash = undefined;
        }
    });


const Query = mongoose.model('Query', querySchema);
module.exports = Query;
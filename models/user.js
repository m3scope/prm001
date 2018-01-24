/**
 * Created by freez on 09.06.2017.
 */
const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const userSchema = new mongoose.Schema({
    username:{
        type:String, // тип: String
        required:[true,"usernameRequired"],
        // Данное поле обязательно. Если его нет вывести ошибку с текстом usernameRequired
        maxlength:[32,"tooLong"],
        // Максимальная длинна 32 Юникод символа (Unicode symbol != byte)
        minlength:[6,"tooShort"],
        // Слишком короткий Логин!
        match:[/^[a-z0-9]+$/,"usernameIncorrect"],
        // Мой любимй формат! ЗАПРЕТИТЬ НИЖНЕЕ ТИРЕ!
        unique:true // Оно должно быть уникальным
    },
    prizmaddress: {
        type: String,
    },
    fiats: [{
        fiatName: {type: String},
        fiatAddress: {type: String},
        fiatAbout: {type: String}
    }],
    publicKey: {
        type: String,
    },
    currPrizm: {
        type: Number, default: 10000
    },
    currGold: {
        type: Number, default: 10000
    },
    currSilver: {
        type: Number, default: 10000
    },
    rezPrizm: {
        type: Number, default: 0
    },
    rezGold: {
        type: Number, default: 0
    },
    rezSilver: {
        type: Number, default: 0
    },
    category: String,
    name_f: String,
    email: {
        type: String,
        required: 'Укажите e-mail',
        unique: 'Такой e-mail уже существует'
    },
    email_confirmed: {
        type: Boolean,
        default: false
    },
    passwordHash: String,
    salt: String
}, {
    timestamps: true
});

userSchema.methods.encryptPassword = function(password){
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
};

userSchema.virtual('password')
    .set(function(password){
        this._plainPassword = password;
        if(password){
            this.salt = crypto.randomBytes(128).toString('base64');
            this.passwordHash = this.encryptPassword(password);
        } else {
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(function(){
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function(password){
    if (!password) return false;
    if (!this.passwordHash) return false;
    return this.encryptPassword(password) == this.passwordHash;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
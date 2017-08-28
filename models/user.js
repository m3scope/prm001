/**
 * Created by freez on 09.06.2017.
 */
const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const userSchema = new mongoose.Schema({
    username: String,
    prizmaddress: {
        type: String,
    },
    category: String,
    name_f: String,
    email: {
        type: String,
        required: 'Укажите e-mail',
        unique: 'Такой e-mail уже существует'
    },
    passwordHash: String,
    salt: String
}, {
    timestamps: true
});

userSchema.virtual('password')
    .set((password) => {
        this._plainPassword = password;
        if (password) {
            console.log(password);
            this.salt = crypto.randomBytes(128).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
        } else {
            console.log('fucking!!!');
            this.salt = undefined;
            this.passwordHash = undefined;
        }
    })
    .get(() => {
        return this._plainPassword;
    });

userSchema.methods.checkPassword = (password) => {
    if (!password) return false;
    if (!this.passwordHash) return false;
    const pwd = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
    return this.passwordHash === pwd;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
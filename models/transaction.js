const mongoose = require('../libs/mongoose');
const crypto = require('crypto'); // модуль node.js для выполнения различных шифровальных операций, в т.ч. для создания хэшей.

const transactionSchema = new mongoose.Schema({
    dealerId: mongoose.Schema.ObjectId,     // Id пользователя создавшего транзакцию
    bayerId: mongoose.Schema.ObjectId,      // Id покупателя
}, {
    timestamps: true
});

const Transaction = mongoose.model('User', transactionSchema);

module.exports = Transaction;
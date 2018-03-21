const loadUser = require("../libs/loadUser");

const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Bank = require('../models/bank');
const banksArr = ['PRIZM','QIWI','Yandex','PerfectMoney'];
const Curr = ['','PZM','USD','RUR'];

exports.get = function (req, res, next) {
    let LoginRegister = '<b><a href="/login">вход</a></b>';
    if(!req.session.user){
        res.redirect('/login');
    } else {
        loadUser.findID(req.session.user, function (err, user) {
            LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';

            res.render('createBank', {title: 'Создать Банковский счет', user: user, LoginRegister: LoginRegister});
        });
    }

};

exports.post = function (req, res, next) {
    console.log('************** Create BANK *********');
    let LoginRegister = '<b><a href="/login">вход</a></b>';
    if(!req.session.user){
        res.redirect('/login');
    } else {
        loadUser.findID(req.session.user, function (err, user) {
            if(err){
                console.error(err);
                res.redirect('/login');
                //res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно отменена!', url: '/profile', title: 'Запрос отменен', user: user, LoginRegister: LoginRegister});
            } else {
                LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
                //res.render('createBank', {title: 'Создать Банковский счет', user: user, LoginRegister: LoginRegister});

                const bank = new Bank;
                bank.dealerId = user._id;
                bank.bank_cod = req.body.bank_cod;
                bank.bank_name = banksArr[req.body.bank_cod];
                bank.bank_number = req.body.bank_number;
                bank.bank_publicKey = req.body.bank_publicKey;
                bank.currency = req.body.currency;
                bank.currency_name = Curr[req.body.currency];
                bank.save();

                res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно выполнена!', url: '/profile', title: 'Новый счет создан', user: user, LoginRegister: LoginRegister});
            }
        });
    }
};
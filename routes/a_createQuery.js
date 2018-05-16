const loadUser = require("../libs/loadUser");

const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Bank = require('../models/bank');
const config = require('config');

const tax = config.get('tax');
const Curr = ['','PZM','USD','RUR'];

const QRCode = require('qrcode');

exports.get = function (req, res, next) {
    console.log('************** QUERY *********');
    let LoginRegister = '<b><a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout">ВЫХОД</a></b>';
    if(!req.session.user){
        res.redirect('/login');
    } else {
        if(req.params.id) {
            Bank.findById(req.params.id, function (err, bank) {
                if(err) console.error(err);
                if(bank) {
                    console.log(bank);
                    res.render('amd_index', {
                        inc: {f: 'a_createQuery', bank: bank},
                        title: 'Создать ЗАПРОС',
                        user: '',
                        LoginRegister: ''
                    });
                } else {
                    res.render('info', {
                        infoTitle: '<div class="w3-yellow">Банк не найден!</div>',
                        infoText: 'Попробуйте запросить позже.',
                        url: '/amd/banks/',
                        title: 'Запрос отклонен!',
                        user: '',
                        LoginRegister: ''
                    });
                }
            });

        } else {
            res.render('info', {
                infoTitle: '<div class="w3-yellow">Банк не найден!</div>',
                infoText: 'Попробуйте запросить позже.',
                url: '/amd/banks/',
                title: 'Запрос отклонен!',
                user: '',
                LoginRegister: ''
            });
        }
    }
};

exports.post = function (req, res, next) {
    console.log('************** QUERY *********');
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout">ВЫХОД</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        } else {
            console.log(req.body.bankId);
            Bank.findById(req.body.bankId, function (err, bank) {

                if(err) console.error(err);
                if(bank){
                    let query = new Query;
                    query.userId = user._id;
                    query.UID = Date.now().toString();
                    query.dealerId = bank.dealerId;
                    query.bankId = bank._id;
                    query.bank_cod = bank.bank_cod;
                    query.bank_name = bank.bank_name;
                    query.dealer_bank_username = bank.bank_username;
                    query.dealer_bank_name = bank.bank_name;
                    query.dealer_bank_number = bank.bank_number;
                    query.bank_number = bank.bank_number;
                    query.bank_publicKey = bank.bank_publicKey;
                    query.amount = req.body.amount;
                    query.currency = bank.currency;
                    query.currency_name = bank.currency_name;
                    query.class = req.body.class;
                    query.sort = 1;
                    query.status = 1;
                    query.comments = query.comments + ' / '+req.body.comments;
                    query.save(function (err, saved_Q) {
                        if (err) console.error(err);
                        console.log(saved_Q._id.toString());
                        res.redirect('/api/q/res/');
                        //********** BANK *******
                        //bank.summ_trans_current = Number(bank.summ_trans_current)-summ;
                        if(req.body.class == 0) {
                            bank.summ_all_current = Math.round((Number(bank.summ_all_current) - (req.body.amount))*100)/100;
                        }
                        bank.save();
                        //---------------------
                    });
                } else {
                    res.render('info', {
                        infoTitle: '<div class="w3-yellow">Банк не найден!</div>',
                        infoText: 'Попробуйте запросить позже.',
                        url: '/amd/banks/',
                        title: 'Запрос отклонен!',
                        user: '',
                        LoginRegister: ''
                    });
                }
            });
        }

    });
};
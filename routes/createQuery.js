const loadUser = require("../libs/loadUser");

const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Bank = require('../models/bank');
const config = require('config');

let tax1 = config.get('tax');    //Загрузка комиссий по-умолчанию
let viptax = config.get('viptax');

const Curr = ['','PZM','USD','RUR'];

const QRCode = require('qrcode');

exports.get = function (req, res, next) {
    console.log('************** QUERY *********');
    let LoginRegister = '<b><a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout">ВЫХОД</a></b>';
    if(!req.session.user){
        res.redirect('/login');
    } else {
        if(req.session.check_email) {
            if (req.params.id) {
                let params = req.params.id.split(';');
                let UserBalance = [0, 0, 0, 0, 0];
                let tax = tax1;
                loadUser.findID(req.session.user, function (err, user) {
                    if (err) res.status(500).send('Внутренняя ошибка!');
                    if (!user) {
                        req.session.destroy();
                        res.redirect('/login');
                    } else {
                        if(user.vip) tax = viptax;    //Загрузка комиссий для "Паровоза"
                        //console.log(tax);
                        UserBalance = [0, Math.round(user.PZM * 100) / 100, Math.round(user.USD * 100) / 100, Math.round(user.RUR * 100) / 100];
                        LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">' + req.session.username + '</span></div><a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">ВЫХОД</a>' +
                            '<div class="w3-right-align w3-small">' +
                            '<span>PZM: </span>' +
                            '<label class="w3-border-bottom"> ' + UserBalance[1] + ' </label>' +
                            '<span>&nbsp; RUR: </span>' +
                            '<label class="w3-border-bottom"> ' + UserBalance[3] + ' </label>' +
                            '<span>&nbsp; USD: </span>' +
                            '<label class="w3-border-bottom"> ' + UserBalance[2] + ' </label></div>';
                        let i = 'q_true_3';
                        switch (params[0]) {
                            case 'true':
                                i = 'q_true_' + params[1];
                                res.render('createquery', {
                                    inc: {f: i, curr: params[1] * 1, tax: tax.tax_in[Curr[params[1]]]},
                                    title: 'Создать ЗАПРОС',
                                    user: user,
                                    LoginRegister: LoginRegister
                                });
                                break;
                            case 'false':
                                i = 'q_false_' + params[1];
                                if (UserBalance[params[1]] < 1) {
                                    res.render('info', {
                                        infoTitle: '<div class="w3-red">Ошибка!</div>',
                                        infoText: 'Не достаточно средств',
                                        url: '/profile',
                                        title: 'Запрос отклонен!',
                                        user: user,
                                        LoginRegister: LoginRegister
                                    });
                                } else {
                                    //console.log('************ fgdjdjdjdjdjdjdjd');
                                    res.render('createquery', {
                                        inc: {f: i, curr: params[1] * 1, tax: tax.tax_out[Curr[params[1]]]},
                                        title: 'Создать ЗАПРОС',
                                        user: user,
                                        LoginRegister: LoginRegister
                                    });
                                }
                                break;
                            default:
                                res.render('createquery', {
                                    inc: {f: i, curr: params[1] * 1, tax: tax.tax_in[Curr[params[1]]]},
                                    title: 'Создать ЗАПРОС',
                                    user: user,
                                    LoginRegister: LoginRegister
                                });
                        }
                    }
                });
            } else {
                res.redirect('/');
            }
        } else {
            res.render('info', {
                infoTitle: '<div class="w3-red">Ошибка!</div>',
                infoText: 'ПОДТВЕРДИТЕ ВАШУ ПОЧТУ (email).',
                url: '/profile',
                title: 'Запрос отклонен!',
                user: '',
                LoginRegister: LoginRegister
            });
        }
    }
};

exports.post = function (req, res, next) {
    console.log('************** QUERY *********');

    if(!req.session.user){
        res.redirect('/login');
    } else {
        loadUser.findID(req.session.user, function (err, user) {
            if(!user){
                res.render('info', {
                    infoTitle: '<div class="w3-red">Ошибка!</div>',
                    infoText: 'Пользователь не найден.',
                    url: '/profile',
                    title: 'Запрос отклонен!',
                    user: '',
                    LoginRegister: ''
                });
            } else {
                let LoginRegister = '<b><a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout">ВЫХОД</a></b>';
                let tax = tax1;
                if (user.vip) tax = viptax;    //Загрузка комиссий для "Паровоза"

                if (req.params.id) {
                    console.log(req.body);
                    const banks = [{QIWI: '+79627948161', Yandex: '410012300589165'}];
                    const query = new Query;

                    const cod = Math.round(Math.random() * 1000000);
                    const bank_cod = Number(req.body.bank_cod);
                    const summ = Number(req.body.deal_amount);
                    const currency = req.body.deal_currency;
                    const curr_cod = req.body.curr_cod;
                    let bank_commiss_summ = 0;
                    const commiss_buy = Math.round((Number(summ) * Number(tax.tax_in[currency][bank_cod]) / 100) * 100) / 100;
                    let commiss_sell = Math.round((Number(summ) * Number(tax.tax_out[currency][bank_cod]) / 100) * 100) / 100;

                    if (Number(req.body.bank_cod) < 1) { //вывод призм, расчет комиссии системы на вывод
                        bank_commiss_summ = 0.05;
                        if (summ > 10) {
                            bank_commiss_summ = Math.round(Number(summ) * 0.5 + 0.005) / 100;
                            if (bank_commiss_summ > 10) {
                                bank_commiss_summ = 10;
                            }
                        }
                        commiss_sell = commiss_sell + bank_commiss_summ;

                    }

                    if (Boolean(Number(req.body.class))) {        // (1 - пополнение)

                        Bank.findOne({
                            bank_cod: req.body.bank_cod,
                            date_in: {$gte: Date.now()},
                            summ_all: {$gte: summ},
                            summ_trans_current: {$gte: summ},
                            currency: curr_cod
                        }).sort({rounds: 1}).exec(function (err, bank) {
                            "use strict";
                            if (err) {
                                console.error(err);
                                res.redirect('/');
                            } else {
                                if (bank) {

                                    //********** QUERY ******
                                    let qrTxt = bank.bank_number + ':' + bank.bank_publicKey + ':' + summ + ':' + cod;
                                    QRCode.toDataURL(qrTxt, function (err, url) {
                                        if (bank.bank_cod == 0) {
                                            query.qrCode = url;
                                        }
                                        query.data = {
                                            bank_cod: bank.bank_cod,
                                            cod: cod,
                                            deal_amount: summ,
                                            deal_currency: bank.currency,
                                            price_amount: req.body.price_amount,
                                            price_currency: req.body.price_currency,
                                            commission_summ: commiss_buy
                                        };
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
                                        query.amount = summ;
                                        query.commission_tax = Number(tax.tax_in[currency][bank.bank_cod]);
                                        query.commission_summ = commiss_buy;
                                        query.currency = bank.currency;
                                        query.currency_name = bank.currency_name;
                                        query.action = 'function()';
                                        query.cod = cod;
                                        query.info = 'Переведите ' + summ + ' ' + bank.currency_name + ' на номер ' + bank.bank_number + ' ' + bank.bank_name;
                                        if (bank_cod == 3) {
                                            query.info = 'Переведите ' + summ + ' ' + bank.currency_name + ' на номер карты ' + bank.bank_number + ' ' + bank.bank_name;
                                        }
                                        query.comment = '<h3><span class="w3-text-red">В комментарии к переводу вставьте код: </span></h3><h1><b>' + cod + '</b></h1>';
                                        query.class = req.body.class;
                                        query.save(function (err, saved_Q) {
                                            if (err) console.error(err);
                                            console.log(saved_Q._id.toString());
                                            res.redirect('/api/q/res/' + saved_Q._id.toString() + ';confirm');
                                            //********** BANK *******
                                            //bank.summ_trans_current = Number(bank.summ_trans_current)-summ;
                                            //bank.summ_all_current = Number(bank.summ_all_current)+summ;

                                            //bank.summ_transactions = Number(bank.summ_trans_current)-summ;
                                            bank.summ_all = Number(bank.summ_all) - summ;

                                            //bank.summ_trans_day = Number(bank.summ_trans_day)+summ;
                                            bank.summ_all_day = Number(bank.summ_all_day) + summ;


                                            //bank.summ_trans_month = Number(bank.summ_trans_month)+summ;
                                            bank.summ_all_month = Number(bank.summ_all_month) + summ;


                                            // bank.summ_transactions =Number( bank.summ_transactions)+summ;
                                            // bank.summ_all = Number(bank.summ_all)+summ;
                                            bank.rounds = Number(bank.rounds) + 20;
                                            bank.save();
                                            //---------------------
                                        });

                                    });


                                    //-------------------------------
                                } else {

                                    res.render('info', {
                                        infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>',
                                        infoText: 'Внутренняя ошибка!',
                                        url: '/profile',
                                        title: 'Запрос отклонен!',
                                        user: user,
                                        LoginRegister: LoginRegister
                                    });

                                }
                            }
                        });

                    } else {        // (0 - вывод средств)
                        // ПРОВЕРИТЬ БАЛАНС

                        if ((Number(user[currency])) >= summ) {
                            //
                            Bank.findOne({
                                bank_cod: req.body.bank_cod,
                                date_out: {$gte: Date.now()},
                                summ_all_current: {$gte: Number(summ)},
                                summ_trans_current: {$gte: Number(summ)},
                                currency: curr_cod
                            }).sort({rounds: -1}).exec(function (err, bank) {
                                "use strict";
                                if (err) {
                                    console.error(err);
                                    res.render('info', {
                                        infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>',
                                        infoText: 'Внутренняя ошибка!',
                                        url: '/profile',
                                        title: 'Запрос отклонен!',
                                        user: user,
                                        LoginRegister: LoginRegister
                                    });
                                } else {
                                    if (bank) {

                                        let qrTxt = req.body.bank_number + ':' + req.body.bank_publicKey + ':' + (summ - Number(commiss_sell)) + ':' + cod + ' | приобретено на prizmex.ru';
                                        QRCode.toDataURL(qrTxt, function (err, url) {
                                            if (bank.bank_cod == 0) {
                                                query.qrCode = url;
                                            }
                                            query.data = {
                                                bank: req.body.bank,
                                                cod: cod,
                                                deal_amount: req.body.deal_amount,
                                                deal_currency: req.body.deal_currency,
                                                price_amount: req.body.price_amount,
                                                price_currency: req.body.price_currency,
                                                commission_summ: commiss_sell
                                            };
                                            query.userId = req.session.user;
                                            query.UID = Date.now().toString();
                                            query.dealerId = bank.dealerId;
                                            query.bankId = bank._id;
                                            query.bank_cod = bank.bank_cod;
                                            query.dealer_bank_username = bank.bank_username;
                                            query.dealer_bank_name = bank.bank_name;
                                            query.dealer_bank_number = bank.bank_number;
                                            query.bank_name = bank.bank_name;
                                            if(user.vip && bank.bank_cod < 1) {
                                                query.bank_number = user.prizmaddress;
                                                query.bank_publicKey = user.publicKey;
                                            } else {
                                                query.bank_number = req.body.bank_number;
                                                query.bank_publicKey = req.body.bank_publicKey;
                                            }
                                            query.amount = summ;
                                            query.commission_tax = Number(tax.tax_out[currency][bank.bank_cod]);
                                        query.bank_commission_summ = bank_commiss_summ;
                                            query.commission_summ = commiss_sell;
                                            query.currency = bank.currency;
                                            query.currency_name = bank.currency_name;
                                            query.action = 'function()';
                                            query.cod = cod;
                                            query.info = 'Подтвердите вывод ' + req.body.deal_amount + ' ' + bank.currency_name + ' на номер ' + bank.bank_number + ' ' + bank.bank_name;
                                            query.comment = '<span class="w3-text-yellow">Средства к получению: ' + (summ - Number(commiss_sell)) + '</span>';
                                            query.class = req.body.class;
                                            query.save(function (err, saved_Q) {
                                                if (err) console.error(err);
                                                console.log(saved_Q._id.toString());


                                                user[currency] = Number(user[currency]) - Number(summ);
                                                user.save();

                                                //********** BANK *******
                                                bank.summ_trans_current = Math.round((Number(bank.summ_trans_current) - Number(summ) + Number(commiss_sell))*100)/100;
                                                bank.summ_all_current = Math.round((Number(bank.summ_all_current) - Number(summ) + Number(commiss_sell))*100)/100;

                                                bank.summ_transactions = Number(bank.summ_trans_current) - summ;
                                                bank.summ_all = Number(bank.summ_all) + summ;

                                                bank.summ_trans_day = Number(bank.summ_trans_day) + summ;
                                                bank.summ_all_day = Number(bank.summ_all_day) - summ;


                                                bank.summ_trans_month = Number(bank.summ_trans_month) + summ;
                                                bank.summ_all_month = Number(bank.summ_all_month) - summ;

                                                // bank.summ_transactions = Number(bank.summ_transactions) - Number(summ);
                                                // bank.summ_all = Number(bank.summ_all) - Number(summ);
                                                bank.rounds = Number(bank.rounds) - 5 - summ;
                                                bank.save();
                                                //---------------------

                                                //res.redirect('/api/q/res/' + saved_Q._id.toString() + ';confirm');
                                                res.redirect('/confirmed/sendconfirmedquery;' + saved_Q._id.toString());
                                            });

                                        });

                                    } else {
                                        res.render('info', {
                                            infoTitle: '<div class="w3-yellow">Внимание!</div>',
                                            infoText: 'Просьба запрос средств сделать на другую платежную систему или уменьшить сумму запроса.',
                                            url: '/profile',
                                            title: 'Запрос отклонен!',
                                            user: user,
                                            LoginRegister: LoginRegister
                                        });
                                    }
                                }
                                //res.render('responsequery', {title: 'Подтвердить ЗАПРОС', user: user, LoginRegister: LoginRegister});

                            });
                        } else {
                            res.render('info', {
                                infoTitle: '<div class="w3-red">Ошибка!</div>',
                                infoText: 'Не достаточно средств',
                                url: '/profile',
                                title: 'Запрос отклонен!',
                                user: user,
                                LoginRegister: LoginRegister
                            });
                        }
                    }

                }
            }


        });
    }
};
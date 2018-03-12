const loadUser = require("../libs/loadUser");

const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Bank = require('../models/bank');
const Curr = {
    'RUR' : [3,'/deals/1;3','/deals/2;3'],
    'USD' : [2,'/deals/1;2','','/deals/2;3'],
    'PZM' : [1,'','/deals/1;2','/deals/1;3']
};

exports.get = function (req, res, next) {
    console.log('************** QUERY *********');
    let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
    if(!req.session.user){
        res.redirect('/login');
    } else {
        if (req.params.id) {
            let params = req.params.id.split(';');
            let UserBalance = [0, 0, 0, 0, 0];
            loadUser.findID(req.session.user, function (err, user) {
                if(err) res.status(500).send('Внутренняя ошибка!');
                if(!user){
                    req.session.destroy();
                    res.redirect('/login');
                } else {
                    //console.log(params);
                    UserBalance = [0,Math.round(user.PZM*100)/100,Math.round(user.USD*100)/100,Math.round(user.RUR*100)/100];
                    LoginRegister = '<b><a href="/profile" class="w3-button w3-border w3-border-white w3-round">'+req.session.username+'</a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">Выход</a></b>' +
                        '<div class="w3-right-align w3-small">' +
                        '<span>PZM: </span>' +
                        '<label class="w3-border-top w3-border-bottom">'+UserBalance[1]+'</label>' +
                        '<span>&nbsp;RUR: </span>' +
                        '<label class="w3-border-top w3-border-bottom">'+UserBalance[3]+'</label>' +
                        '<span>&nbsp;USD: </span>' +
                        '<label class="w3-border-top w3-border-bottom">'+UserBalance[2]+'</label></div>';
                    let i = 'q_true_3';
                    switch (params[0]){
                        case 'true':
                            i = 'q_true_'+ params[1];
                            res.render('createquery', {
                                inc: {f: i, curr: params[1] * 1},
                                title: 'Создать ЗАПРОС',
                                user: user,
                                LoginRegister: LoginRegister
                            });
                            break;
                        case 'false':
                            i = 'q_false_'+params[1];
                            if(UserBalance[params[1]] < 1000){
                                res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Не достаточно средств', url: '/profile', title: 'Запрос отклонен!', user: user, LoginRegister: LoginRegister});
                            } else {
                                //console.log('************ fgdjdjdjdjdjdjdjd');
                                res.render('createquery', {
                                    inc: {f: i, curr: params[1] * 1},
                                    title: 'Создать ЗАПРОС',
                                    user: user,
                                    LoginRegister: LoginRegister
                                });
                            }
                            break;
                        default:
                            res.render('createquery', {
                                inc: {f: i, curr: params[1] * 1},
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
    }
};

exports.post = function (req, res, next) {
    console.log('************** QUERY *********');
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        }
        if(req.params.id) {
            console.log(req.body);
            const banks = [{QIWI: '+79627948161', Yandex: '410012300589165'}];
            const query = new Query;
            const cod = Math.round(Math.random()*1000000);
            const summ = Number(req.body.deal_amount);
            const currency = req.body.deal_currency;
            const commiss_buy = Math.round(Number(summ)*0.05*100)/100;
            const commiss_sell = Math.round(Number(summ)*0.05*100)/100;

            if(Boolean(Number(req.body.class))){        // (1 - пополнение)

                Bank.findOne({bank_cod:req.body.bank_cod, summ_all_current:{$gte:summ}, summ_trans_current:{$gte:summ}}).sort({rounds: 1}).exec(function (err, bank) {
                    "use strict";
                    if(err){
                        console.error(err);
                        res.redirect('/');
                    } else {
                        if(bank){

                            //********** QUERY ******
                            query.data = {bank_cod: bank.bank_cod, cod: cod, deal_amount: summ, deal_currency: bank.currency, price_amount: req.body.price_amount, price_currency: req.body.price_currency, commiss_buy: commiss_buy};
                            query.userId = user._id;
                            query.dealerId = bank.dealerId;
                            query.bankId = bank._id;
                            query.bank_cod = bank.bank_cod;
                            query.bank_name = bank.bank_name;
                            query.bank_number = bank.bank_number;
                            query.bank_publicKey = bank.bank_publicKey;
                            query.amount = summ;
                            query.commission_summ = commiss_buy;
                            query.currency = bank.currency;
                            query.currency_name = bank.currency_name;
                            query.action = 'function()';
                            query.cod = cod;
                            query.info = 'Переведите '+summ + 'р. на номер '+bank.bank_number+ ' '+bank.bank_name;
                            query.comment = '<h3><span class="w3-text-red">В комментарии к переводу вставьте код: </span></h3><h1><b>'+cod+'</b></h1>';
                            query.class = req.body.class;
                            query.save(function (err, saved_Q) {
                                if(err) console.error(err);
                                console.log(saved_Q._id.toString());
                                res.redirect('/api/q/res/'+saved_Q._id.toString()+';confirm');
                                //********** BANK *******
                                bank.summ_trans_current = Number(bank.summ_trans_current)-summ;
                                bank.summ_all_current = Number(bank.summ_all_current)-summ;
                                bank.summ_transactions =Number( bank.summ_transactions)+summ;
                                bank.summ_all = Number(bank.summ_all)+summ;
                                bank.rounds = Number(bank.rounds) + 20;
                                bank.save();
                                //---------------------
                            });
                            //-------------------------------
                        } else {
                            res.redirect('/');
                        }
                    }
                });

            } else {        // (0 - вывод средств)
                // ПРОВЕРИТЬ БАЛАНС

                if((Number(user[currency]))>=summ){
                    //
                    Bank.findOne({bank_cod:req.body.bank_cod, summ_all:{$gte:Number(summ)}, summ_transactions:{$gte:Number(summ)}}).sort({rounds: 1}).exec(function (err, bank) {
                        "use strict";
                        if(err) {
                            console.error(err);
                            res.render('info', {infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>', infoText: 'Внутренняя ошибка!', url: '/profile', title: 'Запрос отклонен!', user: user, LoginRegister: LoginRegister});
                        } else {
                            if(bank){
                                query.data = {
                                    bank: req.body.bank,
                                    cod: cod,
                                    deal_amount: req.body.deal_amount,
                                    deal_currency: req.body.deal_currency,
                                    price_amount: req.body.price_amount,
                                    price_currency: req.body.price_currency,
                                    commiss_buy: commiss_sell
                                };
                                query.userId = req.session.user;
                                query.dealerId = bank.dealerId;
                                query.bankId = bank._id;
                                query.bank_cod = bank.bank_cod;
                                query.bank_name = bank.bank_name;
                                query.bank_number = req.body.bank_number;
                                query.bank_publicKey = req.body.bank_publicKey;
                                query.amount = summ;
                                query.commission_summ = commiss_buy;
                                query.currency = bank.currency;
                                query.currency_name = bank.currency_name;
                                query.action = 'function()';
                                query.cod = cod;
                                query.info = 'Подтвердите вывод ' + req.body.deal_amount + 'р. на номер ' + bank.bank_number + ' ' + bank.bank_name;
                                query.comment = '<span class="w3-text-yellow">Средства к получению: ' + (summ - Number(commiss_sell)) + '</span>';
                                query.class = req.body.class;
                                query.save(function (err, saved_Q) {
                                    if (err) console.error(err);
                                    console.log(saved_Q._id.toString());
                                    res.redirect('/api/q/res/' + saved_Q._id.toString() + ';confirm');

                                    user[currency] = Number(user[currency]) - Number(summ);
                                    user.save();

                                    //********** BANK *******
                                    bank.summ_trans_current = Number(bank.summ_trans_current) + Number(summ);
                                    bank.summ_all_current = Number(bank.summ_all_current) + Number(summ);
                                    bank.summ_transactions = Number(bank.summ_transactions) - Number(summ);
                                    bank.summ_all = Number(bank.summ_all) - Number(summ);
                                    bank.rounds = Number(bank.rounds) + 20;
                                    bank.save();
                                    //---------------------
                                });
                            } else {
                                res.render('info', {infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>', infoText: 'Внутренняя ошибка!', url: '/profile', title: 'Запрос отклонен!', user: user, LoginRegister: LoginRegister});
                            }
                        }
                        //res.render('responsequery', {title: 'Подтвердить ЗАПРОС', user: user, LoginRegister: LoginRegister});


                    });
                } else {
                    res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Не достаточно средств', url: '/profile', title: 'Запрос отклонен!', user: user, LoginRegister: LoginRegister});
                }
        }

    }

    });
};
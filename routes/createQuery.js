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
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        }
        let ids = [true,3];
        let i = 'q_silverAdd';
        if(req.params.id) {
            ids = req.params.id.split(';');
            if (ids[0]!=='true'){
                i = 'q_silverDec';
            }
        }
        console.log(ids);
        // ПРОВЕРИТЬ БАЛАНС

        //
        res.render('createquery', {inc: {f:i,curr:ids[1]*1}, title: 'Создать ЗАПРОС', user: user, LoginRegister: LoginRegister});
    });
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
                            query.data = {bank: req.body.bank, cod: cod, deal_amount: req.body.deal_amount, deal_currency: req.body.deal_currency, price_amount: req.body.price_amount, price_currency: req.body.price_currency, commiss_buy: commiss_buy};
                            query.userId = user._id;
                            query.dealerId = bank.dealerId;
                            query.bankId = bank._id;
                            query.bank_cod = bank.bank_cod;
                            query.bank_name = bank.bank_name;
                            query.bank_number = bank.bank_number;
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
                                bank.summ_trans_current = bank.summ_trans_current-summ;
                                bank.summ_all_current = bank.summ_all_current-summ;
                                bank.summ_transactions = bank.summ_transactions+summ;
                                bank.summ_all = bank.summ_all+summ;
                                bank.rounds = bank.rounds + 20;
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

                if((Number(user[currency])-Number(commiss_sell))>=summ){
                    //
                    Bank.findOne({bank_cod:req.body.bank_cod, summ_all:{$gte:Number(summ)-Number(commiss_sell)}, summ_transactions:{$gte:Number(summ)-Number(commiss_sell)}}).sort({rounds: 1}).exec(function (err, bank) {
                        "use strict";
                        query.data = {bank: req.body.bank, cod: cod, deal_amount: req.body.deal_amount, deal_currency: req.body.deal_currency, price_amount: req.body.price_amount, price_currency: req.body.price_currency, commiss_buy: commiss_sell};
                        query.userId = req.session.user;
                        query.dealerId = bank.dealerId;
                        query.bankId = bank._id;
                        query.bank_cod = bank.bank_cod;
                        query.bank_name = bank.bank_name;
                        query.bank_number = bank.bank_number;
                        query.amount = summ;
                        query.commission_summ = commiss_buy;
                        query.currency = bank.currency;
                        query.currency_name = bank.currency_name;
                        query.action = 'function()';
                        query.cod = cod;
                        query.info = 'Подтвердите вывод '+req.body.deal_amount + 'р. на номер '+req.body.bank_number+ ' '+req.body.bank;
                        query.comment = '<span class="w3-text-yellow">Средства к получению: '+(req.body.deal_amount-commiss_sell)+'</span>';
                        query.class = req.body.class;
                        query.save(function (err, saved_Q) {
                            if(err) console.error(err);
                            console.log(saved_Q._id.toString());
                            res.redirect('/api/q/res/'+saved_Q._id.toString()+';confirm');

                            user[currency] = Number(user[currency])-Number(summ);
                            user.save();

                            //********** BANK *******
                            bank.summ_trans_current = bank.summ_trans_current+summ;
                            bank.summ_all_current = bank.summ_all_current+summ;
                            bank.summ_transactions = bank.summ_transactions-summ;
                            bank.summ_all = bank.summ_all-summ;
                            bank.rounds = bank.rounds + 20;
                            bank.save();
                            //---------------------
                        });
                        //res.render('responsequery', {title: 'Подтвердить ЗАПРОС', user: user, LoginRegister: LoginRegister});


                    });
                } else {
                    res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Не достаточно средств', url: '/profile', title: 'Запрос отклонен!', user: user, LoginRegister: LoginRegister});
                }
        }

    }

    });
};
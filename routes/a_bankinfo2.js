const User = require('../models/user');
const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Transaction = require('../models/transaction');
const Bank = require('../models/bank');
const Reg_Bank = require('../models/reg_bank');

let DCurrent = new Date();

/* GET users listing. */

exports.get = function(req, res) {
    "use strict";
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        if(req.params.id){
            Bank.findById(req.params.id, function (err, bank) {
                if(err) console.error(err);
                if(bank){
                    Reg_Bank.find({BankId: req.params.id}).sort({DateCurrent: -1}).exec(function (err, regBanks) {
                        if(regBanks.length > 0){
                            DCurrent = regBanks[0].DateCurrent;
                        } else { regBanks = []}
                        Query.find({bankId: req.params.id, status: 3, dateExec:{$gte: DCurrent}}).sort({dateExec: 1}).exec(function (err, querys) {
                            if(err) console.error(err);
                            if(querys){
                                res.render('amd_index', {
                                    inc: {f: 'a_bankinfo2'},
                                    title: 'Банк - информация',
                                    bank: bank,
                                    querys: querys,
                                    regBanks: regBanks,
                                    dealerId:req.session.user,
                                    LoginRegister: 'LoginRegister'

                                });
                            } else {
                                res.render('info', {
                                    infoTitle: '<div class="w3-red">Ошибка!</div>',
                                    infoText: 'Банк не найден!',
                                    url: '/amd/banks',
                                    title: 'Запрос отклонен!',
                                    user: {},
                                    LoginRegister: '<b></b>'
                                });
                            }

                        });
                    });

                } else {
                    res.render('info', {
                        infoTitle: '<div class="w3-red">Ошибка!</div>',
                        infoText: 'Банк не найден!',
                        url: '/amd/banks',
                        title: 'Запрос отклонен!',
                        user: {},
                        LoginRegister: '<b></b>'
                    });
                }
            });

        } else {

            Bank.find().sort({bank_cod: 1}).exec(function (err, banks) {
                if(err){
                    console.error(err);
                    res.redirect('/amd/users');
                } else {
                    res.render('amd_index', {
                        inc: {f: 'a_banks'},
                        title: 'Банк',
                        banks: banks,
                        dealerId:req.session.user,
                        LoginRegister: 'LoginRegister'

                    });
                }
            });
        }
    }
};

exports.post = function(req, res) {
    "use strict";
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        const filtr = [{},{status:{$lt:2}},{dealerId:req.session.user},{dealerId:req.session.user,status:{$lt:2}}];
        const lm = (!req.body.limit || Number(req.body.limit) <= 0) ? 20:Number(req.body.limit);


        Query.find(filtr[Number(req.body.filter)]).limit(lm).sort({dateExec: -1}).exec(function (err, querys) {
            if(err){
                console.error(err);
                res.redirect('/amd/users');
            } else {
                res.render('amd_index', {
                    inc: {f: 'a_querys'},
                    title: 'Пользователи',
                    querys: querys,
                    dealerId:req.session.user,
                    LoginRegister: 'LoginRegister'

                });
            }
        });
    }
};
const User = require('../models/user');
const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Transaction = require('../models/transaction');
const Bank = require('../models/bank');

/* GET users listing. */

exports.get = function(req, res) {
    "use strict";
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        if(req.params.id){
            Query.findById(req.params.id).exec(function (err, querys) {
                if (err) {
                    console.error(err);
                    res.redirect('/amd/users');
                } else {
                    if (querys) {

                        res.render('amd_index', {
                            inc: {f: 'a_queryinfo'},
                            title: 'Пользователи',
                            querys: querys,
                            dealerId: req.session.user,
                            LoginRegister: 'LoginRegister'

                        });
                    } else {
                        res.redirect('/amd/users');
                    }
                }
            });

        } else {

            Query.find({dealerId:req.session.user,status:{$lt:2}}).limit(20).sort({createdAt: -1}).exec(function (err, querys) {
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
    }
};

exports.post = function(req, res) {
    "use strict";
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        if(req.params.id){
            console.log(req.params.id);
            Query.findById(req.params.id).exec(function (err, querys) {
                if (err) {
                    console.error(err);
                    res.redirect('/amd/users');
                }
                if (querys) {
                    Bank.findById().exec(function (err, bank) {
                        if(err) console.error(err);
                        if(bank){
                            const bank_commission_summ_OLD = req.body.bank_commission_summ_OLD;
                            const bank_commission_summ = req.body.bank_commission_summ;
                            if(bank_commission_summ > 0){
                                querys.bank_commission_summ = bank_commission_summ;
                                querys.save();
                                bank.summ_all_current = bank.summ_all_current - (bank_commission_summ - bank_commission_summ_OLD);
                                bank.save();
                            }

                            res.redirect('/amd/querys/'+querys._id.toString());
                        } else {
                            res.redirect('/amd/querys/'+querys._id.toString());
                        }

                    });
                } else {
                    res.redirect('/amd/users');
                }
            });

        } else {
            const filtr = [{}, {status: {$lt: 2}}, {dealerId: req.session.user}, {
                dealerId: req.session.user,
                status: {$lt: 2}
            }];
            const lm = (!req.body.limit || Number(req.body.limit) <= 0) ? 20 : Number(req.body.limit);


            Query.find(filtr[Number(req.body.filter)]).limit(lm).sort({createdAt: -1}).exec(function (err, querys) {
                if (err) {
                    console.error(err);
                    res.redirect('/amd/users');
                } else {
                    res.render('amd_index', {
                        inc: {f: 'a_querys'},
                        title: 'Пользователи',
                        querys: querys,
                        dealerId: req.session.user,
                        LoginRegister: 'LoginRegister'

                    });
                }
            });
        }
    }
};
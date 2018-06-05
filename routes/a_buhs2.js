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
            res.render('amd_index', {
                inc: {f: 'a_querys'},
                title: 'Пользователи',
                dateRange: {dateAt: dateAt, dateTo: dateTo},
                querys: querys,
                dealerId:req.session.user,
                LoginRegister: 'LoginRegister'

            });

        } else {

            let dateAt = new Date();
            dateAt.setDate(1);
            dateAt.setHours(0);
            dateAt.setMinutes(0);
            dateAt.setSeconds(0);
            dateAt.setMilliseconds(0);
            const dateTo = new Date();

            Transaction.aggregate(
                [
                    {
                        "$match" : {
                            "sort" : 3.0,
                            "createdAt": {$gte: dateAt}
                        }
                    },
                    {
                        "$group" : {
                            "_id" : "$currency",
                            "amount" : {
                                "$sum" : "$amount"
                            }
                        }
                    }
                ],function (err, aggrTrans) {
                    if(err){
                        console.error(err);
                        res.redirect('/amd/users');
                    } else {

                        Query.aggregate(
                            [
                                {
                                    "$match" : {
                                        "status" : 3.0,
                                        "dateExec": {$gte: dateAt}
                                    }
                                },
                                {
                                    "$group" : {
                                        "_id" : "$currency",
                                        "amount" : {
                                            "$sum" : "$commission_summ"
                                        },
                                        "bank_amount": {
                                            "$sum":"$bank_commission_summ"
                                        }
                                    }
                                }
                            ],function (err, aggrQuery) {
                                if(err){
                                    console.error(err);
                                    res.redirect('/amd/users');
                                } else {

                                    Bank.aggregate(
                                        [
                                            {
                                                "$match" : {
                                                    "bank_cod" : {
                                                        "$lt" : 99.0
                                                    }
                                                }
                                            },
                                            {
                                                "$group" : {
                                                    "_id" : "$bank_name",
                                                    "amount" : {
                                                        "$sum" : "$summ_all_current"
                                                    }
                                                }
                                            }
                                        ],function (err, aggrBanks) {
                                            if(err){
                                                console.error(err);
                                                res.redirect('/amd/users');
                                            } else {
                                                console.log(aggrQuery);
                                                res.render('amd_index', {
                                                    inc: {f: 'a_buhs2'},
                                                    title: 'Бухгалтерия2',
                                                    dateRange: {dateAt: dateAt, dateTo: dateTo},
                                                    aggrTrans: aggrTrans,
                                                    aggrQuery: aggrQuery,
                                                    aggrBanks: aggrBanks,
                                                    userId:req.session.user,
                                                    LoginRegister: 'LoginRegister'

                                                });
                                            }
                                        }
                                    );


                                }
                            }
                        );

                    }

                }
            );
        }
    }
};

exports.post = function(req, res) {
    "use strict";
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {

        let dateAt = new Date(req.body.dateAt);
        //dateAt.setDate(1);
        dateAt.setHours(0);
        dateAt.setMinutes(0);
        dateAt.setSeconds(0);
        dateAt.setMilliseconds(0);

        let dateTo = new Date(req.body.dateTo);
        dateTo.setHours(23);
        dateTo.setMinutes(59);
        dateTo.setSeconds(59);
        dateTo.setMilliseconds(0);
        //console.log(dateAt);
        Transaction.aggregate(
            [
                {
                    "$match" : {
                        "sort" : 3.0,
                        "createdAt": {$gte: dateAt, $lte: dateTo}
                    }
                },
                {
                    "$group" : {
                        "_id" : "$currency",
                        "amount" : {
                            "$sum" : "$amount"
                        }
                    }
                }
            ],function (err, aggrTrans) {
                if(err){
                    console.error(err);
                    res.redirect('/amd/users');
                } else {

                    Query.aggregate(
                        [
                            {
                                "$match" : {
                                    "status" : 3.0,
                                    "dateExec": {$gte: dateAt, $lte: dateTo}
                                }
                            },
                            {
                                "$group" : {
                                    "_id" : "$currency",
                                    "amount" : {
                                        "$sum" : "$commission_summ"
                                    },
                                    "bank_amount": {
                                        "$sum":"$bank_commission_summ"
                                    }
                                }
                            }
                        ],function (err, aggrQuery) {
                            if(err){
                                console.error(err);
                                res.redirect('/amd/users');
                            } else {
                                console.log(aggrQuery);
                                res.render('amd_index', {
                                    inc: {f: 'a_buhs'},
                                    dateRange: {dateAt: dateAt, dateTo: dateTo},
                                    title: 'Бухгалтерия',
                                    aggrTrans: aggrTrans,
                                    aggrQuery: aggrQuery,
                                    userId:req.session.user,
                                    LoginRegister: 'LoginRegister'

                                });
                            }
                        }
                    );

                }

            }
        );
    }
};
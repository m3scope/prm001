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
    }
};

exports.post = function(req, res) {
    "use strict";
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        const filtr = [{},{status:{$lt:2}},{dealerId:req.session.user},{dealerId:req.session.user,status:{$lt:2}}];
        const lm = (!req.body.limit || Number(req.body.limit) <= 0) ? 20:Number(req.body.limit);


        Query.find(filtr[Number(req.body.filter)]).limit(lm).sort({createdAt: -1}).exec(function (err, querys) {
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
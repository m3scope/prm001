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
                inc: {f: 'a_transactions'},
                title: 'Транзакции',
                querys: querys,
                LoginRegister: 'LoginRegister'

            });

        } else {

            Query.find({dealerId:req.session.user,status:{$lt:2}}).limit(20).sort({createdAt: -1}).exec(function (err, querys) {
                if(err){
                    console.error(err);
                    res.redirect('/amd/transactions');
                } else {
                    res.render('amd_index', {
                        inc: {f: 'a_transactions'},
                        title: 'Транзакции',
                        querys: querys,
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
        const filtr = [{status:{$lt:2}},{dealerId:req.session.user},{dealerId:req.session.user,status:{$lt:2}}];
        const lm = (!req.body.limit || Number(req.body.limit) <= 0) ? 20:Number(req.body.limit);


        Query.find(filtr[Number(req.body.filter)]).limit(lm).sort({createdAt: -1}).exec(function (err, querys) {
            if(err){
                console.error(err);
                res.redirect('/amd/transactions');
            } else {
                res.render('amd_index', {
                    inc: {f: 'a_transactions'},
                    title: 'Транзакции',
                    querys: querys,
                    LoginRegister: 'LoginRegister'

                });
            }
        });
    }
};
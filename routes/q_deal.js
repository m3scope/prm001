const loadUser = require("../libs/loadUser");

const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Curr = [['',''],['PZM','rezPzm'],['USD','rezUsd'],['RUR','rezRur']];

exports.get = function(req, res){
    console.log('***********REQ*****************');
    console.log(req.url);
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        }

        if(req.params.id) {
            let ids = req.params.id.split(';');
            if (ids[1] = 'cancel'){
                Deal.findById(ids[0], function (err, deal) {
                    if(err) {
                        console.error(err);
                        res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Внутренняя ошибка!', url: '/', title: 'Отмена ордера', user: user, LoginRegister: LoginRegister});
                    } else {
                        if(deal){
                            deal.status = 3;
                            deal.save(function (err, sdeal) {
                                if(err) {
                                    console.error(err);
                                    res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Внутренняя ошибка!', url: '/', title: 'Отмена ордера', user: user, LoginRegister: LoginRegister});
                                } else {
                                    if(Boolean(deal.class)){        // покупка
                                        //const amount = deal.summ_bill
                                        user[Curr[deal.price_currency][0]] = user[Curr[deal.price_currency][0]] + deal.summ_bill;
                                        user[Curr[deal.price_currency][1]] = user[Curr[deal.price_currency][1]] - deal.summ_bill;
                                        user.save(function (err, u) {
                                            if(err){
                                                console.error(err);
                                                res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Внутренняя ошибка!', url: '/', title: 'Отмена ордера', user: user, LoginRegister: LoginRegister});
                                            } else {
                                                res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Ваш ордер отменен!', url: '/profile', title: 'Отмена ордера', user: user, LoginRegister: LoginRegister});
                                            }
                                        });
                                    } else {        //продажа
                                        user[Curr[deal.deal_currency][0]] = user[Curr[deal.deal_currency][0]] + deal.deal_amount_bill;
                                        user[Curr[deal.deal_currency][1]] = user[Curr[deal.deal_currency][1]] - deal.deal_amount_bill;
                                        user.save(function (err, u) {
                                            if(err){
                                                console.error(err);
                                                res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Внутренняя ошибка!', url: '/', title: 'Отмена ордера', user: user, LoginRegister: LoginRegister});
                                            } else {
                                                res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Ваш ордер отменен!', url: '/profile', title: 'Отмена ордера', user: user, LoginRegister: LoginRegister});
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Внутренняя ошибка!', url: '/', title: 'Отмена ордера', user: user, LoginRegister: LoginRegister});
                        }
                    }
                });
            }
        }
    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};
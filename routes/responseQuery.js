const loadUser = require("../libs/loadUser");
const Userr = require('../models/user');

const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Curr = {
    'RUR' : [3,'/deals/1;3','/deals/2;3'],
    'USD' : [2,'/deals/1;2','','/deals/2;3'],
    'PZM' : [1,'','/deals/1;2','/deals/1;3']
};

exports.get = function (req, res, next) {
    console.log('************** QUERY *********');
    let params = req.params.id.split(';');
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        }
        if(req.params.id) {
            Query.findOne({_id:params[0]}, function (err, qq) {
                if(err) console.error(err);
                if(qq) {
                    if (qq.status == 0) {
                        if(params[1] == 'confirm') {
                            res.render('responsequery', {
                                qq: qq,
                                title: 'Подтвердить ЗАПРОС',
                                user: user,
                                LoginRegister: LoginRegister
                            });
                        } else {
                            qq.status = 4;
                            qq.save();
                            res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно отменена!', url: '/profile', title: 'Запрос отменен', user: user, LoginRegister: LoginRegister});
                        }
                    } else {
                        if(params[1] == 'execut') {
                            res.render('executquery', {
                                qq: qq,
                                title: 'Подтвердить ЗАПРОС',
                                user: user,
                                LoginRegister: LoginRegister
                            });
                        } else {
                            qq.status = 4;
                            qq.save();
                            res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно отменена!', url: '/profile', title: 'Запрос отменен', user: user, LoginRegister: LoginRegister});
                        }
                        //res.redirect('/logout');
                    }
                } else {
                    res.redirect('/logout');
                }
            });
        }
    });
};

exports.post = function (req, res, next) {
    console.log('************** QUERY *********');
    let params = req.params.id.split(';');
    let UserBalance = [0,0,0,0,0];
    let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
    loadUser.findID(req.session.user, function (err, user) {
        if(err) res.status(500).send('Внутренняя ошибка!');
        if(!user){
            req.session.destroy();
            res.redirect('/login');
        } else {
            LoginRegister = '<b><a href="/profile" class="w3-button w3-border w3-border-white w3-round">'+req.session.username+'</a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">Выход</a></b>' +
                '<div class="w3-right-align w3-small">' +
                '<span>PZM: </span>' +
                '<label class="w3-border-top w3-border-bottom">'+UserBalance[1]+'</label>' +
                '<span>&nbsp;RUR: </span>' +
                '<label class="w3-border-top w3-border-bottom">'+UserBalance[3]+'</label>' +
                '<span>&nbsp;USD: </span>' +
                '<label class="w3-border-top w3-border-bottom">'+UserBalance[2]+'</label></div>';
            if(params[1] == 'confirm') {
                Query.findOne({_id:params[0], userId:user._id}, function (err, qq) {
                    if(err) console.error(err);
                    if(qq){
                        //console.log(qq);
                        if(qq.status == 0){
                            qq.status = 1;
                            qq.save();
                            res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно выполнена!', url: '/profile', title: 'Запрос подтвержден', user: user, LoginRegister: LoginRegister});
                        } else {
                            res.redirect('/logout');
                        }
                    } else {
                        res.redirect('/logout');
                    }

                });
            } else {
                Query.findOne({_id:req.params.id, dealerId:user._id}, function (err, qq) {
                    if(err) console.error(err);
                    if(qq){
                        //console.log(qq);
                        if(qq.status == 1){
                            qq.status = 3;
                            qq.save(function (err, qqsaved) {
                                if(err) {
                                    console.error(err);
                                    res.redirect('/logout');
                                } else {
                                    Userr.findById(qqsaved.userId,function (err, userr) {
                                        if(err) {
                                            console.error(err);
                                            res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'User not found! UID: '+qqsaved.UID, url: '/profile', title: 'Запрос подтвержден', user: user, LoginRegister: LoginRegister});
                                        } else {
                                            if(userr){
                                                if(qqsaved.class == 1){
                                                    userr[qqsaved.bank_name] = Number(userr[qqsaved.bank_name])+Number(qqsaved.amount)-Number(qqsaved.commission_summ);
                                                    userr.save();
                                                }
                                                res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно выполнена!', url: '/profile', title: 'Запрос подтвержден', user: user, LoginRegister: LoginRegister});
                                            } else {
                                                console.error('User not found: '+qqsaved.UID);
                                                res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'User not found! UID: '+qqsaved.UID, url: '/profile', title: 'Запрос подтвержден', user: user, LoginRegister: LoginRegister});
                                            }
                                        }
                                    });
                                    //res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно выполнена!', url: '/profile', title: 'Запрос подтвержден', user: user, LoginRegister: LoginRegister});
                                }

                            });
                            //res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно выполнена!', url: '/profile', title: 'Запрос подтвержден', user: user, LoginRegister: LoginRegister});
                        } else {
                            res.redirect('/logout');
                        }
                    } else {
                        res.redirect('/logout');
                    }

                });
            }
    }
});
};
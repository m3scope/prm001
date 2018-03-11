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
    if(!req.session.user){
        res.redirect('/login');
    } else {
        if(req.params.id) {
            let params = req.params.id.split(';');
            let UserBalance = [0,0,0,0,0];
            let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
            loadUser.findID(req.session.user, function (err, user) {
                if(err) res.status(500).send('Внутренняя ошибка!');
                if(!user){
                    req.session.destroy();
                    res.redirect('/login');
                } else {
                    UserBalance = [0,Math.round(user.PZM*100)/100,Math.round(user.USD*100)/100,Math.round(user.RUR*100)/100];
                    //console.log(user.prizmaddress);
                    LoginRegister = '<b><a href="/profile" class="w3-button w3-border w3-border-white w3-round">' + req.session.username + '</a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">Выход</a></b>' +
                        '<div class="w3-right-align w3-small">' +
                        '<span>PZM: </span>' +
                        '<label class="w3-border-top w3-border-bottom">' + UserBalance[1] + '</label>' +
                        '<span>&nbsp;RUR: </span>' +
                        '<label class="w3-border-top w3-border-bottom">' + UserBalance[3] + '</label>' +
                        '<span>&nbsp;USD: </span>' +
                        '<label class="w3-border-top w3-border-bottom">' + UserBalance[2] + '</label></div>';

                    switch (params[1]) {
                        case 'confirm':
                            Query.findOne({_id: params[0], userId: user._id}, function (err, qq) {
                                if (err) console.error(err);
                                if (qq) {
                                    //console.log(qq);
                                    if (qq.status == 0) {
                                        res.render('responsequery', {
                                            qq: qq,
                                            title: 'Подтвердить ЗАПРОС',
                                            user: user,
                                            LoginRegister: LoginRegister
                                        });
                                    } else {
                                        res.redirect('/logout');
                                    }
                                } else {
                                    res.redirect('/logout');
                                }

                            });
                            break;
                        case 'cancel':
                            Query.findOne({_id: params[0], userId: user._id}, function (err, qq) {
                                if (err) console.error(err);
                                if (qq) {
                                    //console.log(qq);
                                    if (qq.status == 0) {
                                        if (qq.class == 0) {
                                            qq.status = 4;
                                            user[qq.currency_name] = Number(user[qq.currency_name]) + Number(qq.amount);
                                            user.save();
                                        } else {
                                            qq.status = 4;
                                        }
                                        qq.save();
                                        res.render('info', {
                                            infoTitle: '<div class="w3-green">Успех!</div>',
                                            infoText: 'Операция успешно выполнена!',
                                            url: '/profile',
                                            title: 'Запрос подтвержден',
                                            user: user,
                                            LoginRegister: LoginRegister
                                        });
                                    } else {
                                        res.redirect('/logout');
                                    }
                                } else {
                                    res.redirect('/logout');
                                }
                            });
                            break;
                        case 'execut':
                            // ********** execut   // добавление на счет
                            Query.findOne({_id: params[0], dealerId: user._id}, function (err, qq) {
                                if (err) console.error(err);
                                if (qq) {
                                    //console.log(qq);
                                    if (qq.status == 1) {
                                        res.render('executquery', {
                                            qq: qq,
                                            title: 'Подтвердить ЗАПРОС',
                                            user: user,
                                            LoginRegister: LoginRegister
                                        });
                                    } else {
                                        res.render('info', {
                                            infoTitle: '<div class="w3-red">Ошибка!</div>',
                                            infoText: 'Операция не выполнена!',
                                            url: '/profile',
                                            title: 'Статус запроса не поддерживается!',
                                            user: user,
                                            LoginRegister: LoginRegister
                                        });
                                        //res.redirect('/logout');
                                    }
                                } else {
                                    res.render('info', {
                                        infoTitle: '<div class="w3-red">Ошибка!</div>',
                                        infoText: 'Операция не выполнена!',
                                        url: '/profile',
                                        title: 'Запрос удален!',
                                        user: user,
                                        LoginRegister: LoginRegister
                                    });
                                    //res.redirect('/logout');
                                }
                            });
                            break;
                        case 'cancelexec':

                            break;
                        default:
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
    let params = req.params.id.split(';');
    let UserBalance = [0,0,0,0,0];
    let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
    loadUser.findID(req.session.user, function (err, user) {
        if(err) res.status(500).send('Внутренняя ошибка!');
        if(!user){
            req.session.destroy();
            res.redirect('/login');
        } else {
            UserBalance = [0,Math.round(user.PZM*100)/100,Math.round(user.USD*100)/100,Math.round(user.RUR*100)/100];
            LoginRegister = '<b><a href="/profile" class="w3-button w3-border w3-border-white w3-round">'+req.session.username+'</a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">Выход</a></b>' +
                '<div class="w3-right-align w3-small">' +
                '<span>PZM: </span>' +
                '<label class="w3-border-top w3-border-bottom">'+UserBalance[1]+'</label>' +
                '<span>&nbsp;RUR: </span>' +
                '<label class="w3-border-top w3-border-bottom">'+UserBalance[3]+'</label>' +
                '<span>&nbsp;USD: </span>' +
                '<label class="w3-border-top w3-border-bottom">'+UserBalance[2]+'</label></div>';
            switch (params[1]){
                case 'confirm':
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
                    break;
                case 'cancel':
                    Query.findOne({_id:params[0], userId:user._id}, function (err, qq) {
                        if(err) console.error(err);
                        if(qq){
                            //console.log(qq);
                            if(qq.status == 0){
                                if(qq.class == 0){
                                    qq.status = 4;
                                    user[qq.currency_name] = Number(user[qq.currency_name])+Number(qq.amount);
                                    user.save();
                                } else {
                                    qq.status = 4;
                                }
                                qq.save();
                                res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Операция успешно выполнена!', url: '/profile', title: 'Запрос подтвержден', user: user, LoginRegister: LoginRegister});
                            } else {
                                res.redirect('/logout');
                            }
                        } else {
                            res.redirect('/logout');
                        }
                    });
                    break;
                case 'execut':
                    // ********** execut   // добавление на счет
                    Query.findOne({_id:params[0], dealerId:user._id}, function (err, qq) {
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
                                                        userr[qqsaved.currency_name] = Number(userr[qqsaved.currency_name])+Number(qqsaved.amount)-Number(qqsaved.commission_summ);
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
                                res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Операция не выполнена!', url: '/profile', title: 'Статус запроса не поддерживается!', user: user, LoginRegister: LoginRegister});
                                //res.redirect('/logout');
                            }
                        } else {
                            res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Операция не выполнена!', url: '/profile', title: 'Запрос удален!', user: user, LoginRegister: LoginRegister});
                            //res.redirect('/logout');
                        }
                    });
                    break;
                case 'canclexec':

                    break;
                default:
            }
    }
});
};
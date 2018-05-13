
const db_email = require('../models/email').Email;
const User = require('../models/user');
const sndMail = require('../libs/sndMail').sndMail;
//var HttpError = require('error').HttpError;

// exports.get = function(req, res, next){
//     const token = req.params.token;
//     db_email.findOne({token: token}, function(err, eml){
//         if(err) next(err);
//         if(eml)
//         {
//             User.findByIdAndUpdate(eml.user_id, {'email.check': true}, function(err){
//                 if(err) next(err);
//                 res.render('email',{text: 'адрес '+eml.email_address+' подтвержден'});
//             });
//         }
//         else
//         {
//             res.render('email',{text: 'адрес почты не найден'});
//         }
//     });
// };
function secretLine(){
    let text='';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( let i=0; i < 128; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

exports.get = function (req, res, next) {
    if (req.params.id) {
        let params = req.params.id.split(';');
        switch (params[0]){
            case 'sendconfirmedemail':
                if(!req.session.user){
                    res.redirect('/login');
                } else {
                    User.findById(req.session.user, function (err, user) {
                        if(err){
                            console.error(err);
                            req.session.destroy();
                            res.redirect('/login');
                        } else {
                            if(!user){
                                req.session.destroy();
                                res.redirect('/login');
                            } else {
                                const SL = secretLine();
                                user.email_token = SL;
                                user.UID = Date.now().toString();
                                //user.email.address = req.body.email;
                                user.save();
                                let text = 'http://prizmex.ru/confirmed/email;'+SL;
                                let new_email_token = db_email({user_id: user._id, email_address: user.email, text: text, token: SL});
                                new_email_token.save();
                                console.log(text);
                                sndMail(user.email, 0, text);
                                //res.send({});
                                res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Проверьте свою почту и перейдите по ссылке! (ПРОВЕРЬТЕ ПАПКУ СПАМ!!!)', url: '/', title: 'Подтверждение e-mail!', user: {}, LoginRegister: '<b></b>'});
                            }
                        }

                    });

                }
                break;

            case 'email':
                db_email.findOne({token: params[1]}, function (err, eml) {
                    if(err){
                        console.error(err);
                    }
                    if(eml){
                        User.findByIdAndUpdate(eml.user_id,{email_confirmed: true}, function (err,user) {
                            req.session.destroy();
                            res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Ваш e-mail подтвержден!', url: '/login', title: 'e-mail подтвержден!', user: {}, LoginRegister: '<b></b>'});

                        });
                    } else {
                        req.session.destroy();
                        res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'E-mail не найден!', url: '/login', title: 'Запрос отклонен!', user: {}, LoginRegister: '<b></b>'});

                    }
                });
                break;

            case 'confirmedquery':
                res.render('confirmedquery',{title: 'Подтверрждение операции!'});
                break;

            case 'droppass':
                res.render('droppass',{title: 'Сброс пароля!'});
                break;

            case 'newpass':
                db_email.findOne({token: params[1]}, function (err, eml) {
                    if(err){
                        console.error(err);
                    }
                    if(eml){
                        User.findOne({email: eml.email_address,email_token: eml.token}, function (err,user) {
                            if(user) {
                                res.render('newpass', {
                                    title: 'Ввод нового пароля',
                                    email_token: eml.token
                                });
                            } else {
                                res.render('info', {
                                    infoTitle: '<div class="w3-green">Успех!</div>',
                                    infoText: 'Ваш e-mail подтвержден!',
                                    url: '/login',
                                    title: 'e-mail подтвержден!',
                                    user: {},
                                    LoginRegister: '<b></b>'
                                });
                            }
                        });
                    } else {
                        req.session.destroy();
                        res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'E-mail не найден!', url: '/login', title: 'Запрос отклонен!', user: {}, LoginRegister: '<b></b>'});

                    }
                });
                break;

            default:

        }
    } else {
        res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Страница не найдена!', url: '/', title: 'Запрос отклонен!', user: {}, LoginRegister: '<b></b>'});
    }
};

exports.post = function (req, res, next) {
    "use strict";
    if (req.params.id) {
        let params = req.params.id.split(';');
        switch (params[0]) {
            case 'newpass':
                if(req.body.email_token) {
                    User.findOne({email_token: req.body.email_token}).exec(function (err, user) {
                        if (user) {
                            user.password = req.body.password;
                            user.email_token = null;
                            user.save();
                            res.render('info', {
                                infoTitle: '<div class="w3-green">Успех!</div>',
                                infoText: 'Ваш пароль изменен!',
                                url: '/login',
                                title: 'Запрос выполнен!',
                                user: {},
                                LoginRegister: '<b></b>'
                            });
                        }
                    });
                } else {
                    res.render('info', {
                        infoTitle: '<div class="w3-red">Ошибка!</div>',
                        infoText: 'E-mail не найден!',
                        url: '/',
                        title: 'Запрос отклонен!',
                        user: {},
                        LoginRegister: '<b></b>'
                    });
                }

                break;

            case 'senddroppass':
                // if(!req.session.user){
                //     res.redirect('/login');
                // } else {
                User.findOne({email:req.body.email}, function (err, user) {
                    if(err){
                        console.error(err);
                        req.session.destroy();
                        res.redirect('/login');
                    } else {
                        if(!user || !user.email_confirmed) {
                            res.render('info', {
                                infoTitle: '<div class="w3-red">Ошибка!</div>',
                                infoText: 'Пользователь с таким email не найден!',
                                url: '/',
                                title: 'Забыл пароль!',
                                user: {},
                                LoginRegister: '<b></b>'
                            });
                        } else {
                            const SL = secretLine();
                            user.email_token = SL;
                            //user.UID = Date.now().toString();
                            //user.email.address = req.body.email;
                            user.save();
                            let text = 'http://prizmex.ru/confirmed/newpass;'+SL;
                            let new_email_token = db_email({user_id: user._id, email_address: user.email, text: text, token: SL});
                            new_email_token.save();
                            console.log(text);
                            sndMail(user.email, 1, text);
                            //res.send({});
                            res.render('info', {infoTitle: '<div class="w3-green">Успех!</div>', infoText: 'Проверьте свою почту и перейдите по ссылке! (ПРОВЕРЬТЕ ПАПКУ СПАМ!!!)', url: '/', title: 'Сброс пароля!!!', user: {}, LoginRegister: '<b></b>'});
                        }
                    }

                });

                //}
                break;

            default:
                res.render('info', {
                    infoTitle: '<div class="w3-red">Ошибка!</div>',
                    infoText: 'E-mail не найден!',
                    url: '/',
                    title: 'Запрос отклонен!',
                    user: {},
                    LoginRegister: '<b></b>'
                });
        }
    } else {
        res.render('info', {
            infoTitle: '<div class="w3-red">Ошибка!</div>',
            infoText: 'E-mail не найден!',
            url: '/',
            title: 'Запрос отклонен!',
            user: {},
            LoginRegister: '<b></b>'
        });
    }
};
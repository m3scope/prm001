const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Deal = require('../models/deal');
const config = require('config');
const amd = config.get('amd');

const db_deals = require('../libs/db_deals');
const authLK = require('../middleware/authLK');
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');
//var users_post = require('./users_post');
const noCache = function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
    return next();
};

//
// const log4js = require('log4js');
// log4js.configure({
//     appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
//     categories: { default: { appenders: ['cheese'], level: 'trace' } }
// });
//
// const logger = log4js.getLogger('cheese');
// logger.info('START SERVER. *******************************');

/* GET home page. */

router.get('/', function(req, res, next) {
    //const id = req.params.id;
    let curr1 = 1;
    let curr2 = 3;
    if(req.params.id){
        const ids = req.params.id.split(';');
        curr1 = ids[0]*1;
        curr2 = ids[1]*1;
        console.log(ids);
    }

    let LoginRegister = '<b><a href="/login">Вход</a> </b>';
    let UserBalance = [0,0,0,0,0];
    let infoText = {txt:'<i>Внимание!<br> Заявки обрабатываются с 7.00 до 21.00 МСК.<br> Биржа работает в ручном режиме. Об ошибках и предложениях сообщать на support@prizmex.ru</i><p>Для полноценного участия в обмене необходимо зарегистрироваться</p><p><br></p>', sign:'Администрация'};
    if(req.session.user){
        req.session.reload(function(err) {
            // session updated
        });
        User.findById(req.session.user, function (err, user) {
            infoText.txt = 'Внимание!' +
                '<p> Заявки обрабатываются с 7.00 до 21.00 МСК.<br> Биржа работает в ручном режиме. Об ошибках и предложениях сообщать на support@prizmex.ru</p>';
            UserBalance = [0,Math.round(user.PZM*100)/100,Math.round(user.USD*100)/100,Math.round(user.RUR*100)/100];
            LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">'+req.session.username+'</span></div><a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">ВЫХОД</a>' +
                '<div class="w3-right-align w3-small">' +
                '<span>PZM: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[1]+' </label>' +
                '<span>&nbsp; RUR: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[3]+' </label>' +
                '<span>&nbsp; USD: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[2]+' </label></div>';
            if(amd.indexOf(req.session.user) > -1) {
                LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">'+req.session.username+'</span></div><a href="/amd/querys" class=" w3-btn w3-border w3-border-green w3-round" >А</a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">ВЫХОД</a>';
            }
            db_deals.getdeals(curr1,curr2, function (err, data) {
                if(err) {
                    res.status(500).send('Внутренняя ошибка!');
                } else {
                    Deal.find({dealerId: user._id, status:{$lt:3}, deal_currency:curr1, price_currency:curr2}).exec(function (err, userDeals) {
                        if(err) {
                            res.status(500).send('Внутренняя ошибка!');
                        } else {
                            res.render('index', {
                                title: 'PRIZM Stock Exchange',
                                user: user,
                                inc: {f: 'deals'},
                                LoginRegister: LoginRegister,
                                userDeals: userDeals,
                                deals: data,
                                UBalance: UserBalance,
                                infoText: infoText
                            });
                        }
                    });

                }
            });
        });
    } else {
        //logger.info('Не зарегистрированный.');
        db_deals.getdeals(curr1,curr2, function (err, data) {
            if (err) res.status(500).send('Внутренняя ошибка!');
            res.render('index', {
                title: 'PRIZM Stock Exchange',
                user: null,
                inc: {f: 'deals'},
                LoginRegister: LoginRegister,
                userDeals: [],
                deals: data,
                UBalance: UserBalance,
                infoText: infoText
            });
        });
    }

});

router.get('/profile/:id?', checkAuth, require('./getProfile').get);
router.post('/profile/:id?', checkAuth, require('./getProfile').post);

router.post('/users', checkAuth, noCache, require('./users_post'), function (req, res){
    let user = req.user;
    res.render('users', {title: 'Ceate new User', user: user});
});

//-----------------------------------------------

//***********************************************
//*********** AUTHENTIFICATION ******************

router.get('/login', (req, res) => {
    res.render('login', {title: 'LOGIN PAGE'});
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, function(err, user){
        if(err) {
            return res.render('info', {infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>', infoText: 'Неправильный логин или пароль', url: '/login', title: 'Вход', user: null, LoginRegister: '<b><a href="/login">вход</a></b>'});
        }
        if(!user) {
            return res.render('info', {infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>', infoText: 'Неправильный логин или пароль', url: '/login', title: 'Вход', user: null, LoginRegister: '<b><a href="/login">вход</a></b>'});
        }
        if(!user.ban) {
            if (user.checkPassword(password)) {
                req.session.user = user._id;
                req.session.username = user.name_f;
                req.session.check_email = user.email_confirmed;
                return res.redirect('/'); //res.status(200).send('Welcome, '+ username + '!');
            }
            //return res.status(200).send('Пользователь не найден!');
            return res.render('info', {
                infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>',
                infoText: 'Неправильный логин или пароль',
                url: '/login',
                title: 'Внутренняя ошибка!',
                user: null,
                LoginRegister: '<b><a href="/login">вход</a></b>'
            });
        } else {
            return res.render('info', {
                infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>',
                infoText: 'Ваш аккаунт заблокирован, обратитесь в тех.поддержку.',
                url: '/',
                title: 'Внутренняя ошибка!',
                user: null,
                LoginRegister: '<b><a href="/login">вход</a></b>'
            });
        }
    });
});

router.get('/logout', (req, res) => {
    "use strict";
    req.session.destroy();
    return res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('register', {title: 'REGISTER PAGE'});
});

router.post('/register', (req, res) => {
    console.log('******  req.body  ********');
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const email = req.body.email;
    const prizmaddress = req.body.prizmaddress;
    const name_f = req.body.name_f;


    if(password == confirmPassword) {
        User.findOne({username: username}, function (err, u) {
            if (err) console.error(err);
            if (u) {
                res.render('info', {
                    infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>',
                    infoText: 'Имя уже существует',
                    url: '/register',
                    title: 'Вход',
                    user: null,
                    LoginRegister: '<b><a href="/login">вход</a></b>'
                });
            } else {
                User.findOne({email: email}, function (err, e_mail) {
                    if (err) console.error(err);
                    if (e_mail) {
                        res.render('info', {
                            infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>',
                            infoText: 'E-Mail уже зарегистрирован',
                            url: '/register',
                            title: 'Вход',
                            user: null,
                            LoginRegister: '<b><a href="/login">вход</a></b>'
                        });
                    } else {
                        const newuser = new User();
                        newuser.username = username;
                        newuser.name_f = name_f;
                        newuser.password = password;
                        newuser.prizmaddress = prizmaddress;
                        newuser.email = email;
                        newuser.save(function (err, savedUser) {
                            if (err) {
                                console.log(err);
                                res.render('info', {
                                    infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>',
                                    infoText: 'Ошибка!',
                                    url: '/register',
                                    title: 'Вход',
                                    user: null,
                                    LoginRegister: '<b><a href="/login">вход</a></b>'
                                });
                            }
                            //return res.status(200).send('Успешная регистрация!');
                            res.render('info', {
                                infoTitle: '<div class="w3-green">Успех!</div>',
                                infoText: 'Операция успешно выполнена!',
                                url: '/login',
                                title: 'Вход',
                                user: null,
                                LoginRegister: '<b><a href="/login">вход</a></b>'
                            });
                        });
                    }
                });
            }
        });
    } else {
        res.render('info', {infoTitle: '<div class="w3-red">Внутренняя ошибка!</div>', infoText: 'Пароли не совпадают', url: '/register', title: 'Вход', user: null, LoginRegister: '<b><a href="/login">вход</a></b>'});
    }

});
//----------------------------------------------

//**********************************************
//**********************************************
 // структура

// router.get('/getrec/:id', (req, res) => {
//     //const request = require("request");
//     let rnd = Math.random();
//     const pzm = req.params.id;
//     const http = require('http');
//     const url = "http://blockchain.prizm.space/prizm?requestType=getAccount&account="+pzm+"&random="+rnd;
//     console.log(url);
//
//     http.get(url, function(ress){
//         let body = '';
//
//         ress.on('data', function(chunk){
//             body += chunk;
//         });
//
//         ress.on('end', function(){
//             let fbResponse = JSON.parse(body);
//             console.log("Got a response: ", fbResponse.transactions[0]);
//             return res.status(200).send(fbResponse.transactions[0]);
//         });
//     }).on('error', function(e){
//         console.log("Got an error: ", e);
//         return res.status(500).send('Внутренняя ошибка!');
//     });
// });

router.get('/gettrans/:id', (req, res) => {
    //const request = require("request");
    //let rnd = Math.random();
    const structure = require('../func/get_sructure');
    structure(req.params.id, function(err, data) {
        if (err) {
            console.log(err);
            return res.status(err.status).send(err.txt);
        }
        //let fbResponse = JSON.parse(data);
        //console.log("Got a response: ", data);
        return res.status(200).send(data);
    });

});

//----------------------------------------------

//**********************************************
//************ БИРЖА ***************************

router.get('/createdeal', checkAuth, noCache, require('./createdeal').get);

router.post('/createdeal', checkAuth, noCache, require('./createdeal').post);

//router.get('/getdeals', checkAuth, noCache, require('./getdeals').get);
router.get('/deals/:id?', function (req, res) {
    //const id = req.params.id;
    let curr1 = 1;
    let curr2 = 2;
    if(req.params.id){
        const ids = req.params.id.split(';');
        curr1 = ids[0]*1;
        curr2 = ids[1]*1;
        console.log(ids);
    }

    let LoginRegister = '<b><a href="/login">Вход</a> </b>';
    let UserBalance = [0,0,0,0,0];
    let infoText = {txt:'<i>Внимание!<br> Заявки обрабатываются с 7.00 до 21.00 МСК.<br> Биржа работает в ручном режиме. Об ошибках и предложениях сообщать на support@prizmex.ru</i><p>Для полноценного участия в обмене необходимо зарегистрироваться</p><p><br></p>', sign:'Администрация'};
    if(req.session.user){
        req.session.reload(function(err) {
            // session updated
        });
        User.findById(req.session.user, function (err, user) {
            infoText.txt = 'Внимание!' +
                '<p> Заявки обрабатываются с 7.00 до 21.00 МСК.<br> Биржа работает в ручном режиме. Об ошибках и предложениях сообщать на support@prizmex.ru</p>';
            UserBalance = [0,Math.round(user.PZM*100)/100,Math.round(user.USD*100)/100,Math.round(user.RUR*100)/100];
            LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">'+req.session.username+'</span></div><a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">ВЫХОД</a>' +
                '<div class="w3-right-align w3-small">' +
                '<span>PZM: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[1]+' </label>' +
                '<span>&nbsp; RUR: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[3]+' </label>' +
                '<span>&nbsp; USD: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[2]+' </label></div>';
            if(amd.indexOf(req.session.user) > -1) {
                LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">'+req.session.username+'</span></div><a href="/amd/querys" class=" w3-btn w3-border w3-border-green w3-round" >А</a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ВВОД / ВЫВОД</label></a>&nbsp;&nbsp;<a href="/profile" class="w3-button w3-border w3-border-white w3-round"><label>ПРОФИЛЬ</label></a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">ВЫХОД</a>';
            }
            db_deals.getdeals(curr1,curr2, function (err, data) {
                if(err) {
                    res.status(500).send('Внутренняя ошибка!');
                } else {
                    Deal.find({dealerId: user._id, status:{$lt:3}, deal_currency:curr1, price_currency:curr2}).exec(function (err, userDeals) {
                        if(err) {
                            res.status(500).send('Внутренняя ошибка!');
                        } else {
                            res.render('index', {
                                title: 'PRIZM Stock Exchange',
                                LoginRegister: LoginRegister,
                                user: user,
                                inc: {f: 'deals'},
                                userDeals: userDeals,
                                deals: data,
                                UBalance: UserBalance,
                                infoText: infoText
                            });
                        }
                    });

                }
            });
        });
    } else {
        db_deals.getdeals(curr1,curr2, function (err, data) {
            if (err) res.status(500).send('Внутренняя ошибка!');
            res.render('index', {
                title: 'PRIZM Stock Exchange',
                LoginRegister: LoginRegister,
                user: null,
                inc: {f: 'deals'},
                userDeals: [],
                deals: data,
                UBalance: UserBalance,
                infoText: infoText
            });
        });
    }

});

//*** BANK *****

router.get('/amd/createbank',  checkAdmin, noCache, require('./createBank').get);
router.post('/amd/createbank',  checkAdmin, noCache, require('./createBank').post);

router.get('/amd/bankinfo/:id?',  checkAdmin, noCache, require('./a_bankinfo').get);
router.post('/amd/bankinfo/:id?',  checkAdmin, noCache, require('./a_bankinfo').post);

router.get('/amd/createquery/:id?',  checkAdmin, noCache, require('./a_createQuery').get);
router.post('/amd/createquery/:id?',  checkAdmin, noCache, require('./a_createQuery').post);

router.get('/amd/banks/:id?',  checkAdmin, noCache, require('./a_banks').get);
router.post('/amd/banks',  checkAdmin, noCache, require('./a_banks').post);

router.get('/amd/buhgalters/:id?',  checkAdmin, noCache, require('./a_buhs').get);
router.post('/amd/buhgalters',  checkAdmin, noCache, require('./a_buhs').post);

router.get('/amd/users/:id?',  checkAdmin, noCache, require('./users').get);
router.post('/amd/users/:id?',  checkAdmin, noCache, require('./users').post);

router.get('/amd/querys/:id?',  checkAdmin, noCache, require('./a_querys').get);
router.post('/amd/querys/:id?',  checkAdmin, noCache, require('./a_querys').post);

router.get('/amd/transactions/:id?',  checkAdmin, noCache, require('./a_querys').get);
router.post('/amd/transactions/',  checkAdmin, noCache, require('./a_querys').post);

router.get('/amd/vips/:id?',  checkAdmin, noCache, require('./a_vips').get);
router.post('/amd/vips/:id?',  checkAdmin, noCache, require('./a_vips').post);

//-----------------------------

//*** (API) - ЗАПРОСЫ / ОТВЕТЫ ********************

router.get('/api/q/res/:id?', checkAuth, noCache, require('./responseQuery').get);
router.post('/api/q/res/:id?', checkAuth, noCache, require('./responseQuery').post);

router.get('/api/q/req/:id?', checkAuth, noCache, require('./createQuery').get);
router.post('/api/q/req/:id?', checkAuth, noCache, require('./createQuery').post);

router.get('/api/q/deal/:id', checkAuth, noCache, require('./q_deal').get);

router.get('/confirmed/:id', noCache, require('./confirmed').get);
router.post('/confirmed/:id', noCache, require('./confirmed').post);

router.get('/edituser/:id?', checkAuth, noCache, require('./edituser').get);
router.post('/edituser/:id?', checkAuth, noCache, require('./edituser').post);

router.get('/qrcode',require('./qrcode').get);


//----------------------------------------------

router.get('/:id', function (req, res) {

    res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Страница не найдена!', url: '/', title: 'Запрос отклонен!', user: {}, LoginRegister: '<b></b>'});
});
module.exports = router;
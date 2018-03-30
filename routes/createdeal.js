const loadUser = require("../libs/loadUser");

const User = require('../models/user');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Curr = {
    'RUR' : [3,'/deals/1;3','/deals/2;3'],
    'USD' : [2,'/deals/1;2','','/deals/2;3'],
    'PZM' : [1,'','/deals/1;2','/deals/1;3']
};

function formatDate(dt, cb) {
    const today = new Date(dt); // сутки (60000*60*24)
    //console.log(today);
    let dd = today.getDate();
    //console.log(dd);
    let mm = today.getMonth()+1; //January is 0!

    let yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    //cb(dd+'/'+mm+'/'+yyyy);
    return dd+'/'+mm+'/'+yyyy;
}

exports.get = function(req, res){
    console.log('***********REQ*****************');
    console.log(req.url);
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        }
        res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

exports.post = function(req, res) {
    console.log('***********REQ*****************');
    //console.log(Curr[req.body.price_currency][Curr[req.body.deal_currency][0]]);

    const tUser = req.session.user;
    let crDeals = false;
    const commission_tax = 0.007;
    //let tdeal_amount, tdeal_currency, tprice_amount, tprice_currency;
    let UserBalance = [0, 0, 0, 0, 0];
    let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';

    if (!req.session.user) {
        res.redirect('/login');
    } else {
        User.findById(req.session.user, function (err, user) {
            if (err) {
                console.error(err);
                res.redirect('/login');
            } else {
                if (!user) {
                    req.session.destroy();
                    res.redirect('/login');
                } else {
                    if (req.body.class * 1) {   // *************   ПОКУПКА  ****************
                        if (user[req.body.price_currency] >= req.body.deal_amount * req.body.price_amount) {
                            user[req.body.price_currency] = Math.round((Number(user[req.body.price_currency]) - Math.round(req.body.deal_amount * req.body.price_amount * 100) / 100)*100)/100;
                            user.save(function (err, userSaved) {
                                if (err) {
                                    console.error(err);
                                    req.session.destroy();
                                    res.redirect('/login');
                                } else {
                                    UserBalance = [0, Math.round(userSaved.PZM * 100) / 100, Math.round(userSaved.USD * 100) / 100, Math.round(userSaved.RUR * 100) / 100];
                                    //console.log(user.prizmaddress);
                                    LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">'+req.session.username+'</span></div><a href="/profile" class="w3-button w3-border w3-border-white w3-round">Профиль</a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">Выход</a>' +
                                        '<div class="w3-right-align w3-small">' +
                                        '<span>PZM: </span>' +
                                        '<label class="w3-border-bottom"> '+UserBalance[1]+' </label>' +
                                        '<span>&nbsp; RUR: </span>' +
                                        '<label class="w3-border-bottom"> '+UserBalance[3]+' </label>' +
                                        '<span>&nbsp; USD: </span>' +
                                        '<label class="w3-border-bottom"> '+UserBalance[2]+' </label></div>';

                                    crDeals = true;
                                    if (crDeals) {
                                        let newDeal = new Deal();
                                        let cl = req.body.class * 1;

                                        newDeal.dealerId = userSaved.id;   //: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего сделку
                                        newDeal.deal_amount = Math.round((req.body.deal_amount)*100)/100;   //: {type: Number, default: 0},      // количество продаваемой валюты
                                        newDeal.deal_amount_bill = Math.round((req.body.deal_amount)*100)/100;   //: {type: Number, default: 0},      // количество продаваемой валюты
                                        newDeal.deal_currency = Curr[req.body.deal_currency][0];   //: {type: Number, default: 0},  // Код (число) валюты продажи
                                        newDeal.price_amount = Math.round((req.body.price_amount)*100)/100;   //: {type: Number, default: 0},       // цена без комиссии
                                        newDeal.price_currency = Curr[req.body.price_currency][0];   //: {type: Number, default: 0},   // Код (число) валюты покупки

                                        newDeal.summ = Math.round((req.body.deal_amount * req.body.price_amount)*100)/100;
                                        newDeal.summ_bill = Math.round((req.body.deal_amount * req.body.price_amount)*100)/100;

                                        newDeal.class = cl;

                                        newDeal.commission_tax = commission_tax;
                                        //newDeal.commission = ((Boolean(cl)) ? Math.round() : Math.round(req.body.price_amount * commission_tax * 10000000)/10000000);   //: {type: Number, default: 0},     // Сумма комиссии (~5-7%)
                                        newDeal.commission_summ = ((Boolean(cl)) ? Math.round((newDeal.deal_amount * commission_tax * 100) / 100) : Math.round((req.body.price_amount * commission_tax * newDeal.deal_amount) * 100) / 100);   // сумма коммисии

                                        newDeal.price = req.body.price_amount * 1;
                                        newDeal.price1 = 1 / req.body.price_amount;

                                        newDeal.status = 0;   //: {type: Number, default: 0},          // Статус сделки (активный, отменен, закрыт)
                                        newDeal.save(function (err, savedDeal) {
                                            if (err) {
                                                console.log(err);
                                                //return res.status(500).send('Внутренняя ошибка!');
                                            }
                                            console.log('--------------------');
                                            // Deal.find({class: Math.abs(req.body.class * 1 - 1), price_amount: {$lt: req.body.price_amount}, status: 0}).limit(10).sort({updatedAt: -1}).exec(function (err, deals) {
                                            //     console.log(deals);
                                            // });
                                            db_bills.createBillsFromDeal(savedDeal._id);
                                            //return res.status(200).send('Успешная регистрация!');
                                        });
                                    }
                                    // res.render('createdeal', {
                                    //     title: 'Создать СДЕЛКУ',
                                    //     user: user,
                                    //     LoginRegister: LoginRegister + '<div class="w3-green">Сделака создана</div>'
                                    // });
                                    //LoginRegister = LoginRegister + '<div class="w3-green">Сделака создана</div>';
                                    // res.redirect(Curr[req.body.price_currency][Curr[req.body.deal_currency][0]]);
                                    res.render('info', {
                                        infoTitle: '<div class="w3-green">Успех!</div>',
                                        infoText: 'Операция успешно выполнена!',
                                        url: Curr[req.body.price_currency][Curr[req.body.deal_currency][0]],
                                        title: 'Создать СДЕЛКУ',
                                        user: user,
                                        LoginRegister: LoginRegister
                                    });

                                }
                            });
                        } else {
                            LoginRegister = LoginRegister + '<div class="w3-red">Недостаточно средств</div>';
                            //res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
                            //res.redirect(Curr[req.body.price_currency][Curr[req.body.deal_currency][0]]);
                            res.render('info', {
                                infoTitle: '<div class="w3-red">Ошибка!</div>',
                                infoText: 'Недостаточно средств!',
                                url: Curr[req.body.price_currency][Curr[req.body.deal_currency][0]],
                                title: 'Создать СДЕЛКУ',
                                user: user,
                                LoginRegister: LoginRegister
                            });
                        }
                    } else {    // ******************* ПРОДАЖА  **************
                        if (user[req.body.deal_currency] >= req.body.deal_amount) {
                            user[req.body.deal_currency] = Math.round((user[req.body.deal_currency] - req.body.deal_amount) * 100) / 100;
                            user.save(function (err, userSaved) {
                                if (err) {
                                    console.error(err);
                                    req.session.destroy();
                                    res.redirect('/login');
                                } else {
                                    UserBalance = [0, Math.round(userSaved.PZM * 100) / 100, Math.round(userSaved.USD * 100) / 100, Math.round(userSaved.RUR * 100) / 100];
                                    LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">'+req.session.username+'</span></div><a href="/profile" class="w3-button w3-border w3-border-white w3-round">Профиль</a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">Выход</a>' +
                                        '<div class="w3-right-align w3-small">' +
                                        '<span>PZM: </span>' +
                                        '<label class="w3-border-bottom"> '+UserBalance[1]+' </label>' +
                                        '<span>&nbsp; RUR: </span>' +
                                        '<label class="w3-border-bottom"> '+UserBalance[3]+' </label>' +
                                        '<span>&nbsp; USD: </span>' +
                                        '<label class="w3-border-bottom"> '+UserBalance[2]+' </label></div>';

                                    crDeals = true;
                                    if (crDeals) {
                                        let newDeal = new Deal();

                                        newDeal.dealerId = userSaved.id;   //: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего сделку
                                        newDeal.deal_amount = Math.round((req.body.deal_amount)*100)/100;   //: {type: Number, default: 0},      // количество продаваемой валюты
                                        newDeal.deal_amount_bill = Math.round((req.body.deal_amount)*100)/100;   //: {type: Number, default: 0},      // количество продаваемой валюты
                                        newDeal.deal_currency = Curr[req.body.deal_currency][0];   //: {type: Number, default: 0},  // Код (число) валюты продажи
                                        newDeal.price_amount = Math.round((req.body.price_amount)*100)/100;   //: {type: Number, default: 0},       // цена без комиссии
                                        newDeal.price_currency = Curr[req.body.price_currency][0];   //: {type: Number, default: 0},   // Код (число) валюты покупки

                                        newDeal.summ = Math.round((req.body.deal_amount * req.body.price_amount)*100)/100;
                                        newDeal.summ_bill = Math.round((req.body.deal_amount * req.body.price_amount)*100)/100;

                                        newDeal.class = req.body.class * 1;

                                        newDeal.commission_tax = commission_tax;
                                        newDeal.commission = Math.round(req.body.price_amount * commission_tax * 100) / 100;   //: {type: Number, default: 0},     // Сумма комиссии (~5-7%)
                                        newDeal.commission_summ = Math.round((req.body.price_amount * commission_tax * newDeal.deal_amount) * 100) / 100;   // сумма коммисии

                                        newDeal.price = req.body.price_amount * 1;
                                        newDeal.price1 = 1 / req.body.price_amount;

                                        newDeal.status = 0;   //: {type: Number, default: 0},          // Статус сделки (активный, отменен, закрыт)
                                        newDeal.save(function (err, savedDeal) {
                                            if (err) {
                                                console.log(err);
                                                //return res.status(500).send('Внутренняя ошибка!');
                                            }
                                            console.log('--------------------');
                                            // Deal.find({class: Math.abs(req.body.class * 1 - 1), price_amount: {$lt: req.body.price_amount}, status: 0}).limit(10).sort({createdAt: 1}).exec(function (err, deals) {
                                            //     console.log(deals);
                                            // });
                                            // db_bills.createBillsFromDeal(savedDeal._id);
                                            db_bills.createBillsFromDeal(savedDeal);    // отправляем объект
                                            //return res.status(200).send('Успешная регистрация!');

                                        });
                                    }
                                    //LoginRegister = LoginRegister + '<div class="w3-green">Сделака создана</div>';
                                    // res.redirect(Curr[req.body.price_currency][Curr[req.body.deal_currency][0]]);
                                    res.render('info', {
                                        infoTitle: '<div class="w3-green">Успех!</div>',
                                        infoText: 'Операция успешно выполнена!',
                                        url: Curr[req.body.price_currency][Curr[req.body.deal_currency][0]],
                                        title: 'Создать СДЕЛКУ',
                                        user: user,
                                        LoginRegister: LoginRegister
                                    });

                                }
                            });
                        } else {
                            LoginRegister = LoginRegister + '<div class="w3-red">Недостаточно средств</div>';
                            //res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
                            //res.redirect(Curr[req.body.price_currency][Curr[req.body.deal_currency][0]]);
                            res.render('info', {
                                infoTitle: '<div class="w3-red">Ошибка!</div>',
                                infoText: 'Недостаточно средств!',
                                url: Curr[req.body.price_currency][Curr[req.body.deal_currency][0]],
                                title: 'Создать СДЕЛКУ',
                                user: user,
                                LoginRegister: LoginRegister
                            });

                        }
                    }
                }
            }
        });
    }

};


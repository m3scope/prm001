const loadUser = require("../libs/loadUser");
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Curr = {
    'currSilver' : 3,
    'currGold' : 2,
    'currPrizm' : 1
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

exports.post = function(req, res){
    //console.log(req);
    const tUser = req.session.user;
    let crDeals = false;
    let tdeal_amount, tdeal_currency, tprice_amount, tprice_currency;
    loadUser.findID(tUser, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!tUser){
            LoginRegister = '<b><a href="/login">вход</a></b>';
        }
        //console.log(req.body.deal_amount);

            if(req.body.class*1){
                if(user[req.body.price_currency]>=req.body.deal_amount*(req.body.price_amount*1+req.body.price_amount*0.05)){
                    //console.log(req.body.deal_amount*(req.body.price_amount*1+req.body.price_amount*0.07));
                    loadUser.saves(req.session.user, [req.body.price_currency], req.body.deal_amount*(req.body.price_amount*1+req.body.price_amount*0.07),Curr[req.body.price_currency], (err, user)=>{
                        "use strict";
                        if(err) res.status(500).send('Внутренняя ошибка!');
                        if(!user){
                            req.session.destroy();
                            res.redirect('/login');
                        } else {
                            //console.log(user.prizmaddress);
                            crDeals = true;
                            if(crDeals) {
                                let newDeal = new Deal();
                                const commission_tax = 0.007;
                                newDeal.dealerId = user.id;   //: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего сделку
                                newDeal.deal_amount = req.body.deal_amount;   //: {type: Number, default: 0},      // количество продаваемой валюты
                                newDeal.deal_amount_bill = req.body.deal_amount;   //: {type: Number, default: 0},      // количество продаваемой валюты
                                newDeal.deal_currency = Curr[req.body.deal_currency];   //: {type: Number, default: 0},  // Код (число) валюты продажи
                                newDeal.price_amount = req.body.price_amount;   //: {type: Number, default: 0},       // цена без комиссии
                                newDeal.price_currency = Curr[req.body.price_currency];   //: {type: Number, default: 0},   // Код (число) валюты покупки

                                newDeal.class = req.body.class * 1;

                                newDeal.commission_tax = commission_tax;
                                newDeal.commission = Math.round(req.body.price_amount * commission_tax * 10000)/10000;   //: {type: Number, default: 0},     // Сумма комиссии (~5-7%)
                                newDeal.commission_summ = (Math.round(req.body.price_amount * commission_tax * 10000)/10000) * newDeal.deal_amount;   // сумма коммисии

                                newDeal.price = req.body.price_amount * 1;
                                newDeal.price1 = 1 / req.body.price_amount;

                                newDeal.status = 0;   //: {type: Number, default: 0},          // Статус сделки (активный, отменен, закрыт)
                                newDeal.save(function (err, savedDeal) {
                                    if (err) {
                                        console.log(err);
                                        //return res.status(500).send('Внутренняя ошибка!');
                                    }
                                    console.log('--------------------');
                                    Deal.find({class: Math.abs(req.body.class * 1 - 1), price_amount: {$lt: req.body.price_amount}, status: 0}).limit(10).sort({updatedAt: -1}).exec(function (err, deals) {
                                        console.log(deals);
                                    });
                                    //return res.status(200).send('Успешная регистрация!');
                                });
                            }
                                    // res.render('createdeal', {
                                    //     title: 'Создать СДЕЛКУ',
                                    //     user: user,
                                    //     LoginRegister: LoginRegister + '<div class="w3-green">Сделака создана</div>'
                                    // });
                            res.redirect('/deals/1;2');
                        }
                    });
                } else {
                    LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b><div class="w3-red">Недостаточно средств</div>';
                    res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
                }
            }
            else {
                if(user[req.body.deal_currency]>=req.body.deal_amount){
                    loadUser.saves(req.session.user, [req.body.deal_currency], req.body.deal_amount,Curr[req.body.deal_currency], (err, user)=>{
                        "use strict";
                        if(err) res.status(500).send('Внутренняя ошибка!');
                        if(!user){
                            req.session.destroy();
                            res.redirect('/login');
                        } else {
                            //console.log(user.prizmaddress);
                            crDeals = true;
                            if(crDeals) {
                                let newDeal = new Deal();
                                const commission_tax = 0.007;
                                newDeal.dealerId = user.id;   //: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего сделку
                                newDeal.deal_amount = req.body.deal_amount;   //: {type: Number, default: 0},      // количество продаваемой валюты
                                newDeal.deal_amount_bill = req.body.deal_amount;   //: {type: Number, default: 0},      // количество продаваемой валюты
                                newDeal.deal_currency = Curr[req.body.deal_currency];   //: {type: Number, default: 0},  // Код (число) валюты продажи
                                newDeal.price_amount = req.body.price_amount;   //: {type: Number, default: 0},       // цена без комиссии
                                newDeal.price_currency = Curr[req.body.price_currency];   //: {type: Number, default: 0},   // Код (число) валюты покупки

                                newDeal.class = req.body.class * 1;

                                newDeal.commission_tax = commission_tax;
                                newDeal.commission = Math.round(req.body.price_amount * commission_tax * 10000)/10000;   //: {type: Number, default: 0},     // Сумма комиссии (~5-7%)
                                newDeal.commission_summ = (Math.round(req.body.price_amount * commission_tax * 10000)/10000) * newDeal.deal_amount;   // сумма коммисии

                                newDeal.price = req.body.price_amount * 1;
                                newDeal.price1 = 1 / req.body.price_amount;

                                newDeal.status = 0;   //: {type: Number, default: 0},          // Статус сделки (активный, отменен, закрыт)
                                newDeal.save(function (err, savedDeal) {
                                    if (err) {
                                        console.log(err);
                                        //return res.status(500).send('Внутренняя ошибка!');
                                    }
                                    console.log('--------------------');
                                    Deal.find({class: Math.abs(req.body.class * 1 - 1), price_amount: {$lt: req.body.price_amount}, status: 0}).limit(10).sort({createdAt: 1}).exec(function (err, deals) {
                                        console.log(deals);
                                    });
                                    //return res.status(200).send('Успешная регистрация!');
                                });
                            }
                            res.render('createdeal', {
                                title: 'Создать СДЕЛКУ',
                                user: user,
                                LoginRegister: LoginRegister + '<div class="w3-green">Сделака создана</div>'
                            });
                        }
                    });
                } else {
                    LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b><div class="w3-red">Недостаточно средств</div>';
                    res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
                }
            }
    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

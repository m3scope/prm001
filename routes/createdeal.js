const loadUser = require("../libs/loadUser");
const Deal = require('../models/deal');
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
    console.log(req.body);
    const tUser = req.session.user;
    let tdeal_amount, tdeal_currency, tprice_amount, tprice_currency;
    loadUser.findID(tUser, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b><p>'+req.body.deal_amount+'</p>';
        if(!tUser){
            LoginRegister = '<b><a href="/login">вход</a></b>';
        }
        //console.log(req.body.deal_amount);
        if(user[req.body.deal_currency]>=req.body.deal_amount){
            loadUser.saves(req.session.user, [req.body.deal_currency], user[req.body.deal_currency]-req.body.deal_amount, (err, user)=>{
                "use strict";
                if(err) res.status(500).send('Внутренняя ошибка!');
                if(!user){
                    req.session.destroy();
                    res.redirect('/login');
                }
                //console.log(user.prizmaddress);
                res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
            });
        } else {
            LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b><p>Недостаточно средств</p>';
            res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
        }

        let newDeal = new Deal();
        newDeal.dealerId = user.id;   //: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },     // Id пользователя создавшего сделку
        newDeal.deal_amount = req.body.deal_amount;   //: {type: Number, default: 0},      // количество продаваемой валюты
        newDeal.deal_amount_bill = req.body.deal_amount;   //: {type: Number, default: 0},      // количество продаваемой валюты
        newDeal.deal_currency = Curr[req.body.deal_currency];   //: {type: Number, default: 0},  // Код (число) валюты продажи
        newDeal.price_amount = req.body.price_amount;   //: {type: Number, default: 0},       // цена без комиссии
        newDeal.price_currency = Curr[req.body.price_currency];   //: {type: Number, default: 0},   // Код (число) валюты покупки
        newDeal.commission = req.body.price_amount*0.07;   //: {type: Number, default: 0},     // Сумма комиссии (~5-7%)
        newDeal.price = req.body.price_amount*1+newDeal.commission;
        newDeal.price1 = 1/newDeal.price;
        newDeal.status = 0;   //: {type: Number, default: 0},          // Статус сделки (активный, отменен, закрыт)
        newDeal.save(function(err, savedDeal){
            if(err) {
                console.log(err);
                //return res.status(500).send('Внутренняя ошибка!');
            }
            //return res.status(200).send('Успешная регистрация!');
        });

    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

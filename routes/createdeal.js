const loadUser = require("../libs/loadUser");
const Deal = require('../models/deal');

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
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        }
        res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

exports.post = function(req, res){
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;<a href="/logout">Выход</a></b><p>'+req.body.deal_amount+'</p>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
        }
        if(user.pzmAmount>=req.body.deal_amount){
            loadUser.saves(req.session.user, 'pzmAmount', user.pzmAmount-req.body.deal_amount , (err, user)=>{
                "use strict";
                if(err) res.status(500).send('Внутренняя ошибка!');
                if(!user){
                    req.session.destroy();
                    res.redirect('/login');
                }
                //console.logтзь(user.prizmaddress);
                res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
            });
        } else {
            LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b><p>Недостаточно средств</p>';
            res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
        }


    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

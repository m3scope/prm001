const loadUser = require("../libs/loadUser");
//const Deal = require('../models/deal');
const sndMail = require('../libs/sndMail').sndMail;
const db_deals = require('../libs/db_deals');
const db_bills = require('../libs/db_bills');
const db_querys = require('../libs/db_querys');
const email = require('../models/email').Email;

function formatDate(dt, cb) {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!

    let yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    cb(dd+'/'+mm+'/'+yyyy);
}

exports.get = function(req, res){
    let UserBalance = [0,0,0,0,0];
    loadUser.findID(req.session.user, function (err, user) {
        UserBalance = [0,Math.round(user.PZM*100)/100,Math.round(user.USD*100)/100,Math.round(user.RUR*100)/100];
        let LoginRegister = '<b><a href="/login">Вход</a> </b>';
        if(req.session.user){
            LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">'+req.session.username+'</span></div><a href="/profile" class="w3-button w3-border w3-border-white w3-round">Профиль</a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">Выход</a>' +
                '<div class="w3-right-align w3-small">' +
                '<span>PZM: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[1]+' </label>' +
                '<span>&nbsp; RUR: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[3]+' </label>' +
                '<span>&nbsp; USD: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[2]+' </label></div>';
        }
            db_deals.getUserDeals(user._id, function (err, userDeals) {
                if(err) console.log(err);
                user.deals = userDeals;
                db_bills.getUserBills(user._id, (err, userBills)=>{
                    "use strict";
                    if(err) console.log(err);
                    user.bills = userBills;
                    db_querys.getUserQuerys(user._id, function (err, userQuerys) {
                        if(err) console.error(err);
                        user.querys = userQuerys;
                        db_querys.getUserQExec(user._id, function (err, userQExec) {
                            if(err) console.error(err);
                            user.userQExec = userQExec;
                            res.render('profile', {title: 'Профиль', user: user, LoginRegister: LoginRegister, UBalance: UserBalance});
                        });
                    });

                });

            });
            //res.render('profile', {title: 'Профиль', user: user, LoginRegister: LoginRegister});
        });

    //res.render('profile', {title: 'USERS authLK', user: User});
};

exports.post = function (req, res, next) {
    //console.log(req.body);
    let UserBalance = [0,0,0,0,0];
    loadUser.findID(req.session.user, function (err, user) {
        UserBalance = [0,Math.round(user.PZM*100)/100,Math.round(user.USD*100)/100,Math.round(user.RUR*100)/100];
        let LoginRegister = '<b><a href="/login">Вход</a> </b>';
        if(req.session.user){
            LoginRegister = '<div class="w3-right-align w3-small"><span class="w3-border-top">'+req.session.username+'</span></div><a href="/profile" class="w3-button w3-border w3-border-white w3-round">Профиль</a>&nbsp;&nbsp;<a href="/logout" class="w3-button w3-border w3-border-white w3-round">Выход</a>' +
                '<div class="w3-right-align w3-small">' +
                '<span>PZM: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[1]+' </label>' +
                '<span>&nbsp; RUR: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[3]+' </label>' +
                '<span>&nbsp; USD: </span>' +
                '<label class="w3-border-bottom"> '+UserBalance[2]+' </label></div>';
        }

        res.render('profile', {title: 'Профиль', user: user, LoginRegister: LoginRegister, UBalance: UserBalance});
    });
};

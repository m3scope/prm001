const loadUser = require("../libs/loadUser");

const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Curr = {
    'currSilver' : [3,'/deals/1;3','/deals/2;3'],
    'currGold' : [2,'/deals/1;2','','/deals/2;3'],
    'currPrizm' : [1,'','/deals/1;2','/deals/1;3']
};

exports.get = function (req, res, next) {
    console.log('************** QUERY *********');
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        }
        let ids = [true,3];
        let i = 'q_silverAdd';
        if(req.params.id) {
            ids = req.params.id.split(';');
            if (ids[0]!=='true'){
                i = 'q_silverDec';
            }
        }
        console.log(ids);
        res.render('createquery', {inc: {f:i,curr:ids[1]*1}, title: 'Создать ЗАПРОС', user: user, LoginRegister: LoginRegister});
    });
};

exports.post = function (req, res, next) {
    console.log('************** QUERY *********');
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
            res.redirect('/login');
        }
        if(req.params.id) {
            const query = new Query;
            query.data = {deal_amount: req.body.deal_amount, deal_currency: req.body.deal_currency, price_amount: req.body.price_amount, price_currency: req.body.price_currency, commission_buy: req.body.commission_buy};
            query.userId = req.session.user;
            query.action = 'function()';
            query.class = req.body.class;
            query.save(function (err, saved_Q) {
                if(err) console.error(err);
                console.log(saved_Q._id.toString());
                res.redirect('/api/q/res/'+saved_Q._id.toString());
            });
        } else {
            //res.render('responsequery', {title: 'Подтвердить ЗАПРОС', user: user, LoginRegister: LoginRegister});
        }

    });
};
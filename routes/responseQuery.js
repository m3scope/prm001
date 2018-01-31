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
        if(req.params.id) {
            Query.findOne({_id:req.params.id}, function (err, qq) {
                res.render('responsequery', {qq:qq, title: 'Подтвердить ЗАПРОС', user: user, LoginRegister: LoginRegister});
            });
        }
    });
};

exports.post = function (req, res, next) {
    Query.findOne({key_Hash:req.params.id});
};
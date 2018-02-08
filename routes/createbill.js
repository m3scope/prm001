const loadUser = require("../libs/loadUser");
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Curr = {
    'RUR' : 3,
    'USD' : 2,
    'PZM' : 1
};

exports.get = function (req, res) {
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';

            res.redirect('/login');
        }
        res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
    });
};
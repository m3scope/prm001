const loadUser = require("../libs/loadUser");
//const Deal = require('../models/deal');
const db_deals = require('../libs/db_deals');

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
    loadUser.findID(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">Вход</a></b>';
        }
            db_deals.getUserDeals(user._id, function (err, userDeals) {
                if(err) console.log(err);
                user.deals = userDeals;
                res.render('profile', {title: 'Профиль', user: user, LoginRegister: LoginRegister});
            });
            //res.render('profile', {title: 'Профиль', user: user, LoginRegister: LoginRegister});
        });

    //res.render('profile', {title: 'USERS authLK', user: User});
};

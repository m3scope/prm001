const loadUser = require("../libs/loadUser");

exports.get = function(req, res){
    loadUser(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
        }
        res.render('profile', {title: 'Профиль', user: user, LoginRegister: LoginRegister});
    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

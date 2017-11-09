const loadUser = require("../libs/loadUser");

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
    loadUser(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;<a href="/logout">Выход</a></b>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
        }
        formatDate(user.createdAt, function(dt){
            //console.log(user.createdAt);
            user.createAt = dt;
            console.log(user.createAt);
            res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
        });

    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

exports.post = function(req, res){
    loadUser(req.session.user, function (err, user) {
        let LoginRegister = '<b><a href="/profile">Профиль</a>&nbsp;<a href="/logout">Выход</a></b><p>'+req.body.deal_amount+'</p>';
        if(!req.session.user){
            LoginRegister = '<b><a href="/login">вход</a></b>';
        }
        formatDate(user.createdAt, function(dt){
            //console.log(user.createdAt);
            user.createAt = dt;
            console.log(user.createAt);
            res.render('createdeal', {title: 'Создать СДЕЛКУ', user: user, LoginRegister: LoginRegister});
        });

    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

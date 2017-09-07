const loadUser = require("../libs/loadUser");

exports.get = function(req, res){
    loadUser(req.session.user, function (err, user) {
        console.log(user);
        res.render('profile', {title: 'USERS authLK', user: user});
    });
    //res.render('profile', {title: 'USERS authLK', user: User});
};

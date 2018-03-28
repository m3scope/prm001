const User = require('../models/user');
/* GET users listing. */
exports.get = function(req, res) {
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {

      User.find({status: 3}).limit(50).sort({createdAt: -1}).exec(function (err, users) {

        res.render('amd_index', {
              inc: {f: 'a_users'},
              title: 'Пользователи',
              users: users,
              LoginRegister: 'LoginRegister'

        });
      });
    }
};

//module.exports = router;

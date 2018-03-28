const User = require('../models/user');
const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Bank = require('../models/bank');
/* GET users listing. */
exports.get = function(req, res) {
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        if(req.params){
            const params = req.params.split(';');

            switch (params[1]){
                case 'cod':

                    Query.findOne({cod:params[0], class: 1}).exec(function (err,query) {

                    });

                    break;

                case 'info':

                    break;

                default:

            }

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
    }
};

//module.exports = router;

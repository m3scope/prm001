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

            //let params = req.params.id.split(';');
            const Curr = ['', 'PZM','USD','RUR'];
            const queryStatus = ['создана', 'подтверждена', '', 'исполнена(закрыта)', 'отменена'];
            const dealStatus = ['создана', 'активный', 'отменен', '', '', '', '', '', '', 'исполнена(закрыт)'];
            let userInfo = [];
            let userDeals = [];
        User.findById(req.session.user).exec(function (err, user) {
            userInfo.sort(compareAge);
            //res.send(userInfo);
            if(err){
                res.redirect();
            } else {
                if(user) {
                    Query.find({userId: user._id}).exec(function (err, query_items) {
                        if(query_items) {
                            query_items.forEach(function (item) {
                                userInfo.push(item);
                            });
                        } else {

                        }
                        Bill.find({dealerGeneralId: user._id}).exec(function (err, bill_items) {
                            if(bill_items) {
                                bill_items.forEach(function (item) {
                                    userInfo.push(item);
                                });
                            } else {

                            }
                            Deal.find({dealerId: user._id,status: {$lt: 3}}).exec(function (err, deal_items) {
                                if(deal_items){
                                    deal_items.forEach(function (item) {
                                        userDeals.push(item);
                                    });
                                } else {

                                }
                                res.render('index', {
                                    inc: {f: 'u_user_info'},
                                    title: 'Пользователь',
                                    users: {user: user, userInfo: userInfo, userDeals: userDeals},
                                    LoginRegister: 'LoginRegister'

                                });
                            });
                        });
                    });


                } else {
                    res.render('info', {
                        infoTitle: '<div class="w3-red">Ошибка!</div>',
                        infoText: 'Операция НЕ выполнена!',
                        url: '/login',
                        title: 'Запрос отменен...',
                        user: {},
                        LoginRegister: 'LoginRegister'
                    });
                }
            }
        });




                    // Query.findOne({cod:params[0], class: 0}).exec(function (err,query) {
                    //     if(query){

    }
};

exports.post = function (req, res) {

        res.redirect('/profile');

};

//module.exports = router;

// Наша функция сравнения
function compareAge(personA, personB) {
    return new Date(personA.createdAt) - new Date(personB.createdAt);

}

/*
// проверка
var vasya = { name: "Вася", age: 23 };
var masha = { name: "Маша", age: 18 };
var vovochka = { name: "Вовочка", age: 6 };

var people = [ vasya , masha , vovochka ];

people.sort(compareAge);

// вывести
for(var i = 0; i < people.length; i++) {
  alert(people[i].name); // Вовочка Маша Вася
}

 */
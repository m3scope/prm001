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
        if(req.params.id){
            let params = req.params.id.split(';');
            const Curr = ['', 'PZM','USD','RUR'];

            switch (params[1]){
                case 'cod':
                    let userInfo = [];
                    Query.findOne({cod:params[0], class: 0}).exec(function (err,query) {
                        if(query){
                            Query.find({userId: query.userId}).exec(function (err, query_items) {
                                query_items.forEach(function (item) {
                                    userInfo.push({
                                        createdAt:item.createdAt,
                                        operation: 'Запрос',
                                        class: item.class==0 ? 'Вывод':'Пополнение',
                                        currency: Curr[item.currency],
                                        amount: item.amount,
                                        currency2: '',
                                        summ: '',
                                        status: item.status
                                    });
                                });

                                Deal.find({dealerId: query.userId}).exec(function (err, deal_items) {
                                    deal_items.forEach(function (item) {
                                        userInfo.push({
                                            createdAt:item.createdAt,
                                            operation: 'Сделка',
                                            class: item.class==0 ? 'Продажа':'Покупка',
                                            currency: Curr[item.deal_currency],
                                            amount: item.deal_amount - item.deal_amount_bill,
                                            currency2: Curr[item.price_currency],
                                            summ: item.summ - item.summ_bill,
                                            status: item.status
                                        });
                                    });

                                    // Bill.find({dealerGeneralId:query.userId}).exec(function (err, bill_items) {
                                    //     bill_items.forEach(function (item) {
                                    //         userInfo.push({
                                    //             createdAt:item.createdAt,
                                    //             operation: 'Bill',
                                    //             class: item.class,
                                    //             currency: item.deal_currency,
                                    //             amount: item.deal_amount,
                                    //             currency2: item.price_currency,
                                    //             summ: item.summ,
                                    //             status: item.status
                                    //         });
                                    //     });
                                    User.findById(query.userId).exec(function (err, user) {
                                        userInfo.sort(compareAge);
                                        //res.send(userInfo);
                                        res.render('amd_index', {
                                            inc: {f: 'a_user_info'},
                                            title: 'Пользователи',
                                            users: {user:user,userInfo:userInfo},
                                            LoginRegister: 'LoginRegister'

                                        });
                                    });

                                    //});
                                });
                            });
                        } else {
                            res.redirect('/amd/users');
                        }

                    });

                    break;

                case 'info':

                    break;

                default:

            }

        } else {
            User.find({status: 1}).limit(50).sort({createdAt: -1}).exec(function (err, users) {

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

exports.post = function (req, res) {
    if(req.body.cod){
        res.redirect('/amd/users/'+req.body.cod+';cod');
    } else {
        res.redirect('/amd/users/');
    }
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
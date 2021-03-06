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
            const queryStatus = ['создана', 'подтверждена', '', 'исполнена(закрыта)', 'отменена'];
            const dealStatus = ['создана', 'активный', 'отменен', '', '', '', '', '', '', 'исполнена(закрыт)'];
            let userInfo = [];
            let userDeals = [];
            switch (params[1]){
                case 'cod':
                    Query.findOne({cod:params[0]}).exec(function (err,query) {
                        if(query){
                            Query.find({userId: query.userId}).exec(function (err, query_items) {
                                query_items.forEach(function (item) {
                                    userInfo.push(item);
                                });

                                    Bill.find({dealerGeneralId:query.userId}).exec(function (err, bill_items) {
                                        bill_items.forEach(function (item) {
                                            userInfo.push(item);
                                         });
                                        Deal.find({dealerId:query.userId,status:{$lt:3}}).exec(function (err, deal_items) {
                                            deal_items.forEach(function (item) {
                                                userDeals.push(item);
                                            });

                                            User.findById(query.userId).exec(function (err, user) {
                                                userInfo.sort(compareAge);
                                                //res.send(userInfo);
                                                res.render('amd_index', {
                                                    inc: {f: 'a_user_info'},
                                                    title: 'Пользователи',
                                                    users: {user:user,userInfo:userInfo,userDeals:userDeals},
                                                    LoginRegister: 'LoginRegister'

                                                });
                                            });
                                        });

                                    });
                            });
                        } else {
                            res.redirect('/amd/users');
                        }

                    });

                    break;

                case 'info':
                    // Query.findOne({cod:params[0], class: 0}).exec(function (err,query) {
                    //     if(query){
                            Query.find({userId: params[0]}).exec(function (err, query_items) {
                                if(query_items) {
                                    query_items.forEach(function (item) {
                                        userInfo.push(item);
                                    });
                                } else {

                                }

                                Bill.find({dealerGeneralId:params[0]}).exec(function (err, bill_items) {
                                    if(bill_items) {
                                        bill_items.forEach(function (item) {
                                            userInfo.push(item);
                                        });
                                        Deal.find({
                                            dealerId: params[0],
                                            status: {$lt: 3}
                                        }).exec(function (err, deal_items) {
                                            deal_items.forEach(function (item) {
                                                userDeals.push(item);
                                            });

                                            User.findById(params[0]).exec(function (err, user) {
                                                userInfo.sort(compareAge);
                                                //res.send(userInfo);
                                                res.render('amd_index', {
                                                    inc: {f: 'a_user_info'},
                                                    title: 'Пользователи',
                                                    users: {user: user, userInfo: userInfo, userDeals: userDeals},
                                                    LoginRegister: 'LoginRegister'

                                                });
                                            });
                                        });
                                    } else {
                                        res.redirect('/amd/users');
                                    }
                                });
                            });
                    //     } else {
                    //         res.redirect('/amd/users');
                    //     }
                    //
                    // });
                    break;

                default:

            }

        } else {
            User.find({status: 1}).limit(1000).sort({PZM: -1,RUR: -1, USD:-1}).exec(function (err, users) {

                User.aggregate(
                    [
                        {
                            "$match" : {
                                "ban" : false
                            }
                        },
                        {
                            "$group" : {
                                "_id" : "$status",
                                "PZM" : {
                                    "$sum" : "$PZM"
                                },
                                "RUR" : {
                                    "$sum" : "$RUR"
                                },
                                "USD" : {
                                    "$sum" : "$USD"
                                }
                            }
                        }
                    ],function (err, userAmount) {
                        if(err) console.error(err);

                        Deal.aggregate(
                            [
                                {
                                    "$match" : {
                                        "status" : {
                                            "$lt" : 3.0
                                        }
                                    }
                                },
                                {
                                    "$group" : {
                                        "_id" : {
                                            "class" : "$class",
                                            "deal_currency" : "$deal_currency",
                                            "price_currency" : "$price_currency"
                                        },
                                        "deal_amount_bill" : {
                                            "$sum" : "$deal_amount_bill"
                                        },
                                        "summ_bill" : {
                                            "$sum" : "$summ_bill"
                                        }
                                    }
                                }
                            ],function (err, userDeals) {
                                res.render('amd_index', {
                                    inc: {f: 'a_users'},
                                    title: 'Пользователи',
                                    users: users,
                                    userAmount: userAmount,
                                    userDeals: userDeals,
                                    LoginRegister: 'LoginRegister'

                                });
                            }
                        );


                        // res.render('amd_index', {
                        //     inc: {f: 'a_users'},
                        //     title: 'Пользователи',
                        //     users: users,
                        //     userAmount: userAmount,
                        //     LoginRegister: 'LoginRegister'
                        //
                        // });
                });

                // res.render('amd_index', {
                //     inc: {f: 'a_users'},
                //     title: 'Пользователи',
                //     users: users,
                //     userAmount: userAmount,
                //     LoginRegister: 'LoginRegister'
                //
                // });
            });
        }
    }
};

exports.post = function (req, res) {
    if(req.params.id){
        switch (req.params.id){
            case 'cod':
                if(req.body.cod){
                    res.redirect('/amd/users/'+req.body.cod+';cod');
                } else {
                    res.redirect('/amd/users/');
                }

                break;

            case 'info':
                if(req.body.cod){
                    res.redirect('/amd/users/'+req.body.cod+';info');
                } else {
                    res.redirect('/amd/users/');
                }
                break;

            default:
                res.redirect('/amd/querys/');
        }
    } else {
        res.redirect('/amd/querys/');
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
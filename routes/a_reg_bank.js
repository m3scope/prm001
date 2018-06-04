const Bank = require('../models/bank');
const Reg_Bank = require('../models/reg_bank');
const User = require('../models/user');

exports.get = function(req, res) {
    "use strict";
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        if(req.params.id){

            res.render('amd_index', {
                inc: {f: 'a_banks'},
                title: 'Банки',
                querys: querys,
                dealerId:req.session.user,
                LoginRegister: 'LoginRegister'

            });

        } else {

            Bank.find().sort({bank_cod: 1}).exec(function (err, banks) {
                if(err){
                    console.error(err);
                    res.redirect('/amd/users');
                } else {
                    res.render('amd_index', {
                        inc: {f: 'a_reg_bank'},
                        title: 'Банк',
                        banks: banks,
                        dealerId:req.session.user,
                        LoginRegister: 'LoginRegister'

                    });
                }
            });
        }
    }
};

exports.post = function(req, res) {
    "use strict";
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        const filtr = [{},{status:{$lt:2}},{dealerId:req.session.user},{dealerId:req.session.user,status:{$lt:2}}];
        const lm = (!req.body.limit || Number(req.body.limit) <= 0) ? 20:Number(req.body.limit);

        User.findById(req.session.user).exec(function (err, user) {
            Bank.findById(req.body.bankId).exec(function (err, bank) {
                if(err){
                    console.error(err);
                    res.redirect('/amd/users');
                } else {
                    let reg_bank = new Reg_Bank();

                    reg_bank.DateCurrent = req.body.dateCurrent;
                    reg_bank.EditUser = user._id;
                    reg_bank.BankId = bank._id;
                    reg_bank.summ_all_current = req.body.summ_all_current;
                    reg_bank.date_in = req.body.date_in;
                    reg_bank.date_out = req.body.date_out;

                    reg_bank.save();

                    Bank.find().sort({bank_cod: 1}).exec(function (err, banks) {
                        if(err){
                            console.error(err);
                            res.redirect('/amd/users');
                        } else {
                            res.render('amd_index', {
                                inc: {f: 'a_reg_bank'},
                                title: 'a_reg_bank',
                                banks: banks,
                                dealerId:req.session.user,
                                LoginRegister: 'LoginRegister'

                            });
                        }
                    });
                }
            });
        });


    }
};
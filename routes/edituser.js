
const User = require('../models/user');
const http = require('http');

const fs = require('fs');

exports.get = function (req, res, next) {
    res.redirect('/');
};

exports.post = function (req, res, next) {

    if(req.session.user && req.body.prizmaddress != ''){
        let pzmaddr = req.body.prizmaddress.trim();
        let rqstring = 'http://tech.prizm-space.com/prizm?=%2Fprizm&requestType=getAccountPublicKey&account='+pzmaddr;
        http.get(rqstring, function (ress) {
            let data = '';
            ress.setEncoding('utf8');
            ress.on('data', function (chunk) {
                data += chunk;
            });
            ress.on('end', function () {
                //JSON.stringify(chunk);
                console.log(JSON.parse(data).publicKey);
                if(JSON.parse(data).publicKey){
                let pubKey = JSON.parse(data).publicKey;
                User.findById(req.session.user, function (err, uusser) {
                    if(err) console.error(err);
                    fs.readFile('vips.txt', 'utf8', function(err, contents) {
                        "use strict";
                        uusser.prizmaddress = pzmaddr;
                        uusser.publicKey = pubKey;
                        if(contents.indexOf(pzmaddr) >= 0){
                            uusser.vip = true;
                        } else {
                            console.log('PrizmAddress is '+ uusser.prizmaddress + ' - false');
                        }
                        uusser.save();
                        //**********************************************
                        User.find({prizmaddress:{$ne: null}}).exec(function (err, users) {
                            if(users.length >0){
                                users.forEach(function (item) {
                                    if(contents.indexOf(item.prizmaddress) >= 0){
                                        item.vip = true;
                                        item.save();
                                    } else {
                                        console.log('PrizmAddress is '+ item.prizmaddress + ' - false');
                                    }

                                });
                            }
                        });
                        //*********************************************
                    });
                    res.render('info', {
                        infoTitle: '<div class="w3-green">Успех!</div>',
                        infoText: 'Ожидайте активации VIP статуса!',
                        url: '/profile',
                        title: 'Ожидайте активации VIP статуса!',
                        user: {},
                        LoginRegister: '<b></b>'
                    });

                });

                } else {
                    res.render('info', {
                        infoTitle: '<div class="w3-red">Ошибка!</div>',
                        infoText: 'Prizm address не найден!',
                        url: '/profile',
                        title: 'Запрос отклонен!',
                        user: {},
                        LoginRegister: '<b></b>'
                    });
                }
            });

        });
    } else {

        res.redirect('/logout');
    }
    // res.render('info', {
    //     infoTitle: '<div class="w3-red">Ошибка!</div>',
    //     infoText: 'E-mail не найден!',
    //     url: '/',
    //     title: 'Запрос отклонен!',
    //     user: {},
    //     LoginRegister: '<b></b>'
    // });
};
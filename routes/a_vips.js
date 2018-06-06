const fs = require('fs');
const User = require('../models/user');

let i =0;

exports.get = function(req, res) {
    fs.readFile('vips.txt', 'utf8', function(err, contents) {
        User.find({prizmaddress:{$ne: null}}).exec(function (err, users) {
            if(users.length >0){
                users.forEach(function (item) {
                    if(contents.indexOf(item.prizmaddress) >= 0){
                        i++;
                        console.log('VIPs is '+i);
                        item.vip = true;
                        item.save();
                    } else {
                        console.log('PrizmAddress is '+ item.prizmaddress + ' - false');
                    }

                });
                res.render('info', {
                    infoTitle: '<div class="w3-green">Успех!</div>',
                    infoText: 'VIP\'s присвоены!',
                    url: '/amd/users',
                    title: 'Процедура выполнена!',
                    user: {},
                    LoginRegister: '<b></b>'
                });
            }
        });

});


};

exports.post = function (req, res) {



};


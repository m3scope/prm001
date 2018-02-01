const CurrName = ['', 'Pzm', 'Usd', 'Rur'];
const loadUser = require("../libs/loadUser");
const Deal = require('../models/deal');
const db_deals = require('../libs/db_deals');
const Curr = {
    'Rur' : 3,
    'Usd' : 2,
    'Pzm' : 1
};

exports.get = function (req, res) {
    if (req.session.user !== undefined) {

    }
    db_deals.getdeals(1,2, function (err, data) {
        if(err) res.status(500).send('Внутренняя ошибка!');

        res.send(data);
    });
};
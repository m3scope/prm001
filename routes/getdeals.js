const CurrName = ['', 'Prizm', 'Gold', 'Silver'];
const loadUser = require("../libs/loadUser");
const Deal = require('../models/deal');
const db_deals = require('../libs/db_deals');
const Curr = {
    'currSilver' : 3,
    'currGold' : 2,
    'currPrizm' : 1
};

exports.get = function (req, res) {
    if (req.session.user !== undefined) {

    }
    db_deals.getdeals(1,2, function (err, data) {
        if(err) res.status(500).send('Внутренняя ошибка!');

        res.send(data);
    });
};
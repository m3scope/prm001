const CurrName = ['', 'Prizm', 'Gold', 'Silver'];
const loadUser = require("../libs/loadUser");
const Deal = require('../models/deal');
const Curr = {
    'currSilver' : 3,
    'currGold' : 2,
    'currPrizm' : 1
};

exports.get = function (req, res) {
    if (req.session.user !== undefined) {

    }
    Deal.aggregate([
        {
            $match:{deal_currency: 1, price_currency: 2}
        },
        {
            $group: { _id: "$price_amount", commission: "$commission", deal_am: { $sum: "$deal_amount_bill" }}
        }
    ], function (err, data) {
        console.log(data);
        res.send(data);
    });

};
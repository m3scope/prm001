const Deal = require('../models/deal');

exports.getdeals = function (curr1, curr2, cb) {
    Deal.aggregate([
        {
            $match:{deal_currency: curr1, price_currency: curr2}
        },
        {
            $group: { _id: "$price", deal_am: { $sum: "$deal_amount_bill" }}
        }
    ], function (err, data) {
        console.log(data);
        if (err) cb(err, null);
        cb(null, data);
    });

};
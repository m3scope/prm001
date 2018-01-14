const Deal = require('../models/deal');

exports.getdeals = function (curr1, curr2, cb) {
    let dt1 = null;
    let dt2 = null;
    Deal.aggregate([
        {
            $match:{deal_currency: curr1, price_currency: curr2, status: 0, class: 0}
        },
        {
            $group: { _id: "$price", deal_am: { $sum: "$deal_amount_bill" }}
        },
        { $sort: { _id: 1 }}
    ], function (err, data1) {
        console.log(data1);
        if (err) cb(err, null);
        dt1 = data1;
        Deal.aggregate([
            {
                $match:{deal_currency: curr1, price_currency: curr2, status: 0, class: 1}
            },
            {
                $group: { _id: "$price", deal_am: { $sum: "$deal_amount_bill" }}
            },
            { $sort: { _id: -1 }}
        ], function (err, data2) {
            console.log(data2);
            if (err) cb(err, null);
            dt2 =data2;
            cb(null, {curr1: curr1, curr2: curr2, dt1:dt1, dt2:dt2});
        });
    });

};

exports.getUserDeals = function (userId, cb) {
    Deal.find({dealerId: userId, status: 0}).limit(10).sort({createdAt: 1}).exec(function (err, deals) {
        console.log(deals);
        cb(null, deals);
    });
};
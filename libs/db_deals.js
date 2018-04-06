const Deal = require('../models/deal');

exports.getdeals = function (curr1, curr2, cb) {        // 1;2
    let dt1 = null;
    let dt2 = null;
    if (curr1>3 || isNaN(Number(curr1))) curr1=1;
    if(curr2>3 || isNaN(Number(curr2))) curr2=3;
    Deal.aggregate([
        {
            $match:{deal_currency: curr1, price_currency: curr2, status: {$lt:2}, class: 0}
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
                $match:{deal_currency: curr1, price_currency: curr2, status: {$lt:2}, class: 1}
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
    Deal.find({dealerId: userId}).limit(100).sort({createdAt: -1}).exec(function (err, deals) {
        console.log(deals);
        cb(null, deals);
    });
};
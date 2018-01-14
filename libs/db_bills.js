//const loadUser = require("loadUser");
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Curr = {
    'currSilver' : 3,
    'currGold' : 2,
    'currPrizm' : 1
};

//const dealId = Deal.ObjectId("5a532408b1dc980da81bfcc1");

exports.createBillsFromDeal = function (dealId) {
    Deal.findOne({_id: dealId}, function (err, dataDeal) {
        if(err) console.log(err);
        Deal.find({class: Math.abs(dataDeal.status*1 - 1), price_amount: {$lt: dataDeal.price_amount}, status: 0}).limit(1).sort({updatedAt: -1}).exec(function (err, deals) {
            console.log(deals);
        });
    });
};
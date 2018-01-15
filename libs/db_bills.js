//const loadUser = require("loadUser");
const Deal = require('../models/deal');

const Bill = require('../models/bill');
const Curr = {
    'currSilver' : 3,
    'currGold' : 2,
    'currPrizm' : 1
};

//const dealId = Deal.ObjectId("5a532408b1dc980da81bfcc1");
function requestAsync(saldo) {

}

exports.createBillsFromDeal = function (dealId) {
    Deal.findOne({_id: dealId}, function (err, dataDeal) {
        if(err) console.log(err);
        Deal.find({
            class: Math.abs(dataDeal.status*1 - 1),
            price_amount: {$lte: dataDeal.price_amount},
            status: 0
        })
            .limit(100)
            .sort({price_amount: 1, createdAt: 1})
            .exec(function (err, deals) {
                console.log('------------- DEALS -----------');
                console.log(deals);
                if(err) console.log(err);
                if(deals.length>0){
                    let num = 0;
                    async function cr_Bill(amount) {
                        let saldo = amount;
                        // noinspection JSAnnotator
                        do {
                            let data = await requestAsync(saldo);
                            num++;
                        } while (saldo <= 0 || num = deals.length);
                    }
                }
        });
    });
};
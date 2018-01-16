//const loadUser = require("loadUser");
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Curr = {
    'currSilver' : 3,
    'currGold' : 2,
    'currPrizm' : 1
};

function cr_Bill(dealID, deal_amount, deal2Id, cb) {
    let newGeneralBill = new Bill;
    let newTwoBill = new Bill;

    Deal.findById(dealID, function(err, dealOne){
        "use strict";
        if(err) console.error(err);

        Deal.findById(deal2Id, function(err, dealTwo){

            newTwoBill.dealGeneralIdId = dealTwo._id;
            newTwoBill.dealTwoId = dealOne._id;

            newTwoBill.dealerGeneralId = dealTwo.dealerId;
            newTwoBill.dealerTwoId = dealOne.dealerId;

            newTwoBill.deal_amount = deal_amount;
            newTwoBill.deal_currency = dealTwo.deal_currency;

            newTwoBill.price_amount = dealTwo.price_amount;
            newTwoBill.price_currency = dealTwo.price_currency;

            newTwoBill.summ = deal_amount * dealTwo.price_amount;

            newTwoBill.commission_tax = dealTwo.commission_tax;
            newTwoBill.commission_summ = deal_amount * dealTwo.price_amount * dealTwo.commission_tax;

            newTwoBill.save((err, savedTwoBill)=>{
                "use strict";
                if(err) {
                    console.error(err);
                    cb(err, null);
                }
                //cb(null, savedBill);
            });

            newGeneralBill.dealGeneralIdId = dealOne._id;
            newGeneralBill.dealTwoId = dealTwo._id;

            newGeneralBill.dealerGeneralId = dealOne.dealerId;
            newGeneralBill.dealerTwoId = dealTwo.dealerId;

            newGeneralBill.deal_amount = deal_amount;
            newGeneralBill.deal_currency = dealOne.deal_currency;

            newGeneralBill.price_amount = dealOne.price_amount;
            newGeneralBill.price_currency = dealOne.price_currency;

            newGeneralBill.summ = deal_amount * dealOne.price_amount;

            newGeneralBill.commission_tax = dealOne.commission_tax;
            newGeneralBill.commission_summ = deal_amount * dealOne.price_amount * dealOne.commission_tax;

            newGeneralBill.save((err, savedGeneralBill)=>{
                "use strict";
                if(err) {
                    console.error(err);
                    cb(err, null);
                }
                //cb(null, savedBill);
            });

        });
    });




}

//const dealId = Deal.ObjectId("5a532408b1dc980da81bfcc1");
async function requestAsync(dealID, saldo, deal2Id) {
    let data = {};
    let deal_amount_bill = 0;
    Deal.findById(deal2Id, (err, deal2) => {
        "use strict";
        if(err) console.error(err);
        if(saldo <= deal2.deal_amount_bill){
            deal2.deal_amount_bill = deal2.deal_amount_bill - saldo;
            deal2.save((err)=>{
                if(err) console.error(err);
                Deal.findById(dealID, (err, deal)=>{
                    if(err) console.error(err);
                    deal.deal_amount_bill = deal.deal_amount_bill - saldo;
                    deal.save((err)=>{
                        if(err) console.error(err);
                        data.saldo = 0;
                        cr_Bill(dealID, saldo, deal2Id);
                        return data;
                    });
                });
            });
        } else {
            deal_amount_bill = deal2.deal_amount_bill;
            data.saldo = saldo - deal_amount_bill;
            deal2.deal_amount_bill = 0;
            deal2.save((err)=>{
                if(err) console.error(err);
                Deal.findById(dealID, (err, deal)=>{
                    if(err) console.error(err);
                    deal.deal_amount_bill = deal.deal_amount_bill - deal_amount_bill;
                    deal.save((err)=>{
                        if(err) console.error(err);
                        cr_Bill(dealID, deal_amount_bill, deal2Id);
                        return data;
                    });
                });
            });
        }
    });
    //return data;
}

exports.createBillsFromDeal = function (dealId) {
    Deal.findOne({_id: dealId}, function (err, dataDeal) {
        if(err) console.error(err);
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
                if(err) console.error(err);
                if(deals.length>0){
                    let num = 0;
                    async function update_Deals(amount) {
                        let saldo = amount;
                        // noinspection JSAnnotator
                        for (let deal of deals){
                            let data = await requestAsync(dataDeal._id, saldo, deal._id);
                            saldo = data.saldo;
                            if(saldo <=0) {break;}
                            num++;
                        }
                    }
                    update_Deals(dataDeal.deal_amount_bill);
                }
        });
    });
};
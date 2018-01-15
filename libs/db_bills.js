//const loadUser = require("loadUser");
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Curr = {
    'currSilver' : 3,
    'currGold' : 2,
    'currPrizm' : 1
};

function cr_Bill(dealID, saldo, deal2Id, cb) {
    let newBill = new Bill;


    newBill.save((err, savedBill)=>{
        "use strict";
        if(err) {
            console.error(err);
            cb(err, null);
        }
        cb(null, savedBill);
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
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
                    return cb(err, null, null);
                }
                newTwoBill.save((err, savedTwoBill)=>{
                    "use strict";
                    if(err) {
                        console.error(err);
                        return cb(err, null, null);
                    }
                    return cb(null, savedGeneralBill, savedTwoBill);
                });
                //cb(null, savedBill);
            });

        });
    });
}

//const dealId = Deal.ObjectId("5a532408b1dc980da81bfcc1");

/*async function DealsFromSaldo(genDealID, saldo, dealTwoID) {
    let resSaldo = 0;
    let generalDeal = await Deal.findOne({_id: genDealID});
    let dealTwo = await Deal.findOne({_id: dealTwoID});
    if(saldo <= dealTwo.deal_amount_bill){
        dealTwo.deal_amount_bill = dealTwo.deal_amount_bill - saldo;
        if(dealTwo.deal_amount_bill <= 0) {
            dealTwo.status = 9;
        }
        dealTwo.save((err, tDeal)=>{
            "use strict";
           /!* cr_Bill(genDealID, saldo, dealTwoID, (err, o, t)=>{
                if(err) console.error(err);
            });*!/
        });
        generalDeal.deal_amount_bill = generalDeal.deal_amount_bill - saldo;
        if(generalDeal.deal_amount_bill <= 0) {
            generalDeal.status = 9;
        }
        generalDeal.save((err, gDeal)=>{
            "use strict";
            cr_Bill(genDealID._id, saldo, dealTwoID._id, (err, o, t)=>{
                if(err) console.error(err);
            });
            //resSaldo.amount_bill = gDeal.deal_amount_bill;
            console.log('********* DealsFromSaldo / resSaldo');
            //console.log(resSaldo);
            return true;
        });

    } else {
        let deal_amount_bill = dealTwo.deal_amount_bill;
        resSaldo = saldo - deal_amount_bill;
        dealTwo.deal_amount_bill = 0;
        dealTwo.status = 9;
        dealTwo.save((err, tDeal)=>{
            "use strict";
            /!*cr_Bill(genDealID, saldo, dealTwoID, (err, o, t)=>{
                if(err) console.error(err);
            });*!/
        });
        generalDeal.deal_amount_bill = generalDeal.deal_amount_bill - deal_amount_bill;
        if(generalDeal.deal_amount_bill <= 0) {
            generalDeal.status = 9;
        }
        generalDeal.save((err, gDeal)=>{
            "use strict";
            cr_Bill(genDealID._id, saldo, dealTwoID._id, (err, o, t)=>{
                if(err) console.error(err);
            });
            //resSaldo.amount_bill = gDeal.deal_amount_bill;
            console.log('********* DealsFromSaldo / resSaldo');
            //console.log(resSaldo);
            return true;
        });

    }

}*/

/*async function requestAsync(dealID, saldo, deal2Id) {
    let data = {};
    let deal_amount_bill = 0;
    Deal.findById(deal2Id, (err, deal2) => {
        "use strict";
        if(err) console.error(err);

        if(saldo <= deal2.deal_amount_bill){
            data.saldo = 0;
            deal2.deal_amount_bill = deal2.deal_amount_bill - saldo;
            if(deal2.deal_amount_bill - saldo <= 0) deal2.status = 9;
            deal2.save((err)=>{
                if(err) console.error(err);
                Deal.findById(dealID, (err, deal)=>{
                    if(err) console.error(err);
                    deal.deal_amount_bill = deal.deal_amount_bill - saldo;
                    if(deal.deal_amount_bill - saldo <= 0) deal.status = 9;
                    deal.save((err)=>{
                        if(err) console.error(err);
                        cr_Bill(dealID, saldo, deal2Id);
                    });
                });
            });
            return data;
        } else {
            deal_amount_bill = deal2.deal_amount_bill;
            data.saldo = saldo - deal_amount_bill;
            deal2.deal_amount_bill = 0;
            deal2.status = 9;
            deal2.save((err)=>{
                if(err) console.error(err);
                Deal.findById(dealID, (err, deal)=>{
                    if(err) console.error(err);
                    deal.deal_amount_bill = deal.deal_amount_bill - deal_amount_bill;
                    if(deal.deal_amount_bill - saldo <= 0) deal.status = 9;
                    deal.save((err)=>{
                        if(err) console.error(err);
                        cr_Bill(dealID, deal_amount_bill, deal2Id);
                    });
                });
            });
            return data;
        }
    });
    //return data;
}*/

async function BillsFromDeal(dealId) {
    let deals = [];
    let generalDeal = await Deal.findOne({_id: dealId});

    if(Math.abs(generalDeal.class*1)) {     // 1 - покупка
        deals = await Deal.find({
            class: Math.abs(generalDeal.class * 1 - 1),
            price_amount: {$lte: generalDeal.price_amount},
            status: 0
        })
            .limit(100)
            .sort({price_amount: 1, createdAt: 1});
    } else {
        deals = await Deal.find({
            class: Math.abs(generalDeal.class * 1 - 1),
            price_amount: {$gte: generalDeal.price_amount},
            status: 0
        })
            .limit(100)
            .sort({price_amount: -1, createdAt: 1});
    }

    let saldo = generalDeal.deal_amount_bill;
    let num = 0;
    for (let dealTwo of deals) {
        console.log('--------- SALDO --------------');
        console.log(''+saldo+' / '+ num);
        console.log(dealTwo);

        if(saldo <= dealTwo.deal_amount_bill) {
            dealTwo.deal_amount_bill = dealTwo.deal_amount_bill - saldo;
            if(dealTwo.deal_amount_bill <= 0) {
                dealTwo.status = 9;
            }
            dealTwo.save((err, tDeal)=>{
                "use strict";
                /* cr_Bill(genDealID, saldo, dealTwoID, (err, o, t)=>{
                     if(err) console.error(err);
                 });*/
            });
            generalDeal.deal_amount_bill = generalDeal.deal_amount_bill - saldo;
            if(generalDeal.deal_amount_bill <= 0) {
                generalDeal.status = 9;
            }
            cr_Bill(generalDeal._id, saldo, dealTwo._id, (err, o, t)=>{
                if(err) console.error(err);
            });
        } else {
            let deal_amount_bill = dealTwo.deal_amount_bill;
            saldo = saldo - deal_amount_bill;
            dealTwo.deal_amount_bill = 0;
            dealTwo.status = 9;
            dealTwo.save((err, tDeal) => {
                "use strict";
                /*cr_Bill(genDealID, saldo, dealTwoID, (err, o, t)=>{
                    if(err) console.error(err);
                });*/
            });
            generalDeal.deal_amount_bill = generalDeal.deal_amount_bill - deal_amount_bill;
            if (generalDeal.deal_amount_bill <= 0) {
                generalDeal.status = 9;
            }
            cr_Bill(generalDeal._id, deal_amount_bill, dealTwo._id, (err, o, t) => {
                if (err) console.error(err);
            });
        }

        //let data = await DealsFromSaldo(generalDeal._id, saldo, deal._id);  // requestAsync(generalDeal._id, saldo, deal._id);
        // console.log('*********** data');
        // console.log(data);
        // saldo = data;
        if (saldo <= 0) {
            break;
        }
        num++;
    }
    generalDeal.save((err, gDeal)=>{
        "use strict";
        //resSaldo.amount_bill = gDeal.deal_amount_bill;
        console.log('********* DealsFromSaldo / resSaldo');
        //console.log(resSaldo);
        //return resSaldo;
    });

    console.log('1111****************************');
    console.log(generalDeal);
    console.log('2222****************************');
    console.log(deals);
    return {err: null, g: generalDeal, d: deals};
}

//BillsFromDeal(ObjectId("5a5ef5bde7c85705e44183b6"));

/*exports.createBillsFromDeal = async function (dealId, cb) {
    Deal.findOne({_id: dealId}, async function (err, dataDeal) {
        if(err) console.error(err);
        console.log('------------- CLASS -------------');
        console.log(Math.abs(dataDeal.class*1 - 1));
        if(Math.abs(dataDeal.class*1)){     // 1 - покупка
            Deal.find({
                class: Math.abs(dataDeal.class * 1 - 1),
                price_amount: {$lte: dataDeal.price_amount},
                status: 0
            })
                .limit(100)
                .sort({price_amount: 1, createdAt: 1})
                .exec(async function (err, deals) {
                    console.log('------------- DEALS -----------');
                    console.log(deals);
                    if (err) console.error(err);
                    if (deals.length > 0) {
                        let num = 0;
                        let saldo =0;
                        async function update_Deals(amount) {
                            saldo = amount;
                            // noinspection JSAnnotator
                            for (let deal of deals) {
                                console.log('--------- SALDO --------------');
                                console.log(''+saldo+' / '+ num);
                                let data = await requestAsync(dataDeal._id, saldo, deal._id);
                                console.log('*********** data');
                                console.log(data);
                                saldo = data.saldo;
                                if (saldo <= 0) {
                                    break;
                                }
                                num++;
                            }
                        }
                        update_Deals(dataDeal.deal_amount_bill);
                        return cb(null, dealId);
                    }
                });
        } else {
            Deal.find({
                class: Math.abs(dataDeal.class * 1 - 1),
                price_amount: {$gte: dataDeal.price_amount},
                status: 0
            })
                .limit(100)
                .sort({price_amount: -1, createdAt: 1})
                .exec(function (err, deals) {
                    console.log('------------- DEALS -----------');
                    console.log(deals);
                    if (err) console.error(err);
                    if (deals.length > 0) {
                        let num = 0;
                        let saldo = 0;
                        async function update_Deals(amount) {
                            saldo = amount;
                            // noinspection JSAnnotator
                            for (let deal of deals) {
                                console.log('--------- SALDO --------------');
                                console.log(''+saldo+' / '+ num);
                                let data = await requestAsync(dataDeal._id, saldo, deal._id);
                                console.log('*********** data');
                                console.log(data);
                                saldo = data.saldo;
                                if (saldo <= 0) {
                                    break;
                                }
                                num++;
                            }
                        }

                        update_Deals(dataDeal.deal_amount_bill);
                        return cb(null, dealId);
                    }
                });
        }
    });
};*/

exports.createBillsFromDeal = (dealId)=>{
    BillsFromDeal(dealId);
};
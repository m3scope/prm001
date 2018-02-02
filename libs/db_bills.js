//const loadUser = require("loadUser");
const User = require('../models/user');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Transaction = require('../models/transaction');
const Curr = ['','Pzm','Usd','Rur'];
const rezCurr = ['', 'rezPzm', 'rezUsd', 'rezRur'];
const sort_Name = [
    ['',''],
    ['Списание проданной вылюты', 'Зачисление купленной валюты'],
    ['Списание оплаты','Зачисление оплаты'],
    ['Списание комиссии',''],
    ['','']
];

function updUserBalance(userId, addCurr, addSum, deductCurr, deductSumm) {
    console.log('*** updUserBalance ***');
    User.findById(userId, function (err, user) {
        if(err) console.error(err);
        if(!user) {
            console.log(new Error('User not found!!!'))
        } else {
            user[Curr[addCurr]] = user[Curr[addCurr]] + addSum;
            user[rezCurr[deductCurr]] = user[rezCurr[deductCurr]] - deductSumm;
            user.save();
        }


    })
}

function crTrans(bill) {
    if(bill.class){     // покупка
        //for(let i=0; i<4; i++){
        //******** ЗАЧИСЛЕНИЕ КУПЛЕННОЙ
            let newTrans = new Transaction;
            newTrans.sort = 1;
            console.log('----------- sortName[1][1] --------------');
        console.log(sort_Name[1][1]);
        newTrans.sortName = sort_Name[1][1];
            newTrans.billId = bill._id;
            newTrans.userId = bill.dealerGeneralId;
            newTrans.currency = bill.deal_currency;
            newTrans.amount = bill.deal_amount;
            newTrans.up_down = true;

            newTrans.save();
        //******** СПИСАНИЕ ОПЛАТЫ
        let newTrans2 = new Transaction;
        newTrans2.sort = 2;
        newTrans2.sortName = sort_Name[2][0];
        newTrans2.billId = bill._id;
        newTrans2.userId = bill.dealerGeneralId;
        newTrans2.currency = bill.price_currency;
        newTrans2.amount = bill.deal_amount*bill.price_amount;
        newTrans2.up_down = false;
        newTrans2.save();

        //******** СПИСАНИЕ КОМИССИИ
        let newTrans3 = new Transaction;
        newTrans3.sort = 3;
        newTrans3.sortName = sort_Name[3][0];
        newTrans3.billId = bill._id;
        newTrans3.userId = bill.dealerGeneralId;
        newTrans3.currency = bill.deal_currency;
        newTrans3.amount = bill.commission_summ;
        newTrans3.up_down = false;
        newTrans3.save();

        //}
    } else {        // Продажа
        //for(let i=0; i<4; i++){
        //******** СПИСАНИЕ ПРОДАННОЙ
        let newTrans4 = new Transaction;
        newTrans4.sort = 1;
        newTrans4.sortName = sort_Name[1][0];
        newTrans4.billId = bill._id;
        newTrans4.userId = bill.dealerGeneralId;
        newTrans4.currency = bill.deal_currency;
        newTrans4.amount = bill.deal_amount;
        newTrans4.up_down = false;
        newTrans4.save();
        //******** Зачисление ОПЛАТЫ
        let newTrans5 = new Transaction;
        newTrans5.sort = 2;
        newTrans5.sortName = sort_Name[2][1];
        newTrans5.billId = bill._id;
        newTrans5.userId = bill.dealerGeneralId;
        newTrans5.currency = bill.price_currency;
        newTrans5.amount = bill.deal_amount*bill.price_amount;
        newTrans5.up_down = true;
        newTrans5.save();

        //******** СПИСАНИЕ КОМИССИИ
        let newTrans6 = new Transaction;
        newTrans6.sort = 3;
        newTrans6.sortName = sort_Name[3][0];
        newTrans6.billId = bill._id;
        newTrans6.userId = bill.dealerGeneralId;
        newTrans6.currency = bill.price_currency;
        newTrans6.amount = bill.commission_summ;
        newTrans6.up_down = false;
        newTrans6.save();

        //******** зачисление комиссии сервису в валюте оплаты
        /*let newTrans = new Transaction;
        newTrans.sort = 3;
        newTrans.billId = bill._id;
        newTrans.userId = bill.dealerGeneralId;
        newTrans.currency = bill.deal_currency;
        newTrans.amount = bill.deal_amount;
        newTrans.up_down = false;*/
        //}

    }
}

async function cr_Bill(dealID, deal_amount, deal2Id) {
    let newGeneralBill = new Bill;
    let newTwoBill = new Bill;

    Deal.findById(dealID, function(err, dealOne){
        "use strict";
        if(err) console.error(err);

        Deal.findById(deal2Id, function(err, dealTwo){

            const price_amount = ((dealTwo.price_amount<dealOne.price_amount) ? dealTwo.price_amount : dealOne.price_amount);
            const commission_summ_One = (Boolean(dealOne.class)) ? deal_amount * dealOne.commission_tax : deal_amount * price_amount * dealOne.commission_tax;
            const commission_summ_Two = (Boolean(dealTwo.class)) ? deal_amount * dealTwo.commission_tax : deal_amount * price_amount * dealTwo.commission_tax;

            newTwoBill.dealGeneralId = dealTwo._id;
            newTwoBill.dealTwoId = dealOne._id;

            newTwoBill.dealerGeneralId = dealTwo.dealerId;
            newTwoBill.dealerTwoId = dealOne.dealerId;

            newTwoBill.deal_amount = deal_amount;
            newTwoBill.deal_currency = dealTwo.deal_currency;

            newTwoBill.price_amount = price_amount; //dealTwo.price_amount;
            newTwoBill.price_currency = dealTwo.price_currency;

            newTwoBill.summ = deal_amount * price_amount;

            newTwoBill.class = dealTwo.class;

            newTwoBill.commission_tax = dealTwo.commission_tax;
            newTwoBill.commission_summ = commission_summ_Two;



            // newTwoBill.saldo_price = Math.abs(dealOne.price_amount - dealTwo.price_amount);
            // newTwoBill.saldo_summ = deal_amount * (Math.abs(price_amount - dealTwo.price_amount));

            //*******************************

            newGeneralBill.dealGeneralId = dealOne._id;
            newGeneralBill.dealTwoId = dealTwo._id;

            newGeneralBill.dealerGeneralId = dealOne.dealerId;
            newGeneralBill.dealerTwoId = dealTwo.dealerId;

            newGeneralBill.deal_amount = deal_amount;
            newGeneralBill.deal_currency = dealOne.deal_currency;

            newGeneralBill.price_amount = price_amount; //dealOne.price_amount;
            newGeneralBill.price_currency = dealOne.price_currency;

            newGeneralBill.summ = deal_amount * price_amount;

            newGeneralBill.class = dealOne.class;

            newGeneralBill.commission_tax = dealOne.commission_tax;
            newGeneralBill.commission_summ = commission_summ_One;



            // newGeneralBill.saldo_price = Math.abs(dealOne.price_amount - dealTwo.price_amount);
            // newGeneralBill.saldo_summ = deal_amount * (Math.abs(dealOne.price_amount - dealTwo.price_amount));

//**********************
            newGeneralBill.save((err, savedGeneralBill)=>{
                "use strict";
                if(err) {
                    console.error(err);
                    //return cb(err, null, null);
                }
                dealOne.bills.push({billId: savedGeneralBill._id});
                //dealOne.deal_amount_bill = dealOne.deal_amount_bill - savedGeneralBill.deal_amount;
                if(dealOne.class*1){
                    updUserBalance(savedGeneralBill.dealerGeneralId, savedGeneralBill.deal_currency, savedGeneralBill.deal_amount - savedGeneralBill.commission_summ, savedGeneralBill.price_currency, savedGeneralBill.summ);
                    // if(savedGeneralBill.price_amount > newTwoBill.price_amount){
                    //     //******** зачисление разницы в цене
                    //     //******** непредвиденное сальдо
                    //     let newTrans = new Transaction;
                    //     newTrans.sort = 9;
                    //     newTrans.billId = savedGeneralBill._id;
                    //     newTrans.userId = savedGeneralBill.dealerGeneralId;
                    //     newTrans.currency = savedGeneralBill.deal_currency;
                    //     newTrans.amount = savedGeneralBill.deal_amount * (savedGeneralBill.price_amount - newTwoBill.price_amount);
                    //     newTrans.up_down = true;
                    //     newTrans.save();
                    // }
                } else {
                    updUserBalance(savedGeneralBill.dealerGeneralId, savedGeneralBill.price_currency, savedGeneralBill.summ - savedGeneralBill.commission_summ, savedGeneralBill.deal_currency, savedGeneralBill.deal_amount);
                }
                // if(dealOne.deal_amount_bill <= 0) {
                //     dealOne.status = 9;
                // }
                dealOne.save();
                crTrans(savedGeneralBill);

//*************************
                newTwoBill.save((err, savedTwoBill)=>{
                    "use strict";
                    if(err) {
                        console.error(err);
                        //return cb(err, null, null);
                    }
                    if(dealTwo.class*1){
                        if(newTwoBill.price_amount > savedGeneralBill.price_amount){
                            //******** зачисление разницы в цене
                            //******** непредвиденное сальдо
                            let newTrans = new Transaction;
                            newTrans.sort = 9;
                            newTrans.billId = savedGeneralBill._id;
                            newTrans.userId = savedGeneralBill.dealerGeneralId;
                            newTrans.currency = savedGeneralBill.deal_currency;
                            newTrans.amount = savedGeneralBill.deal_amount * (newTwoBill.price_amount - savedGeneralBill.price_amount);
                            newTrans.up_down = true;
                            newTrans.save();
                        }
                        updUserBalance(savedTwoBill.dealerGeneralId, savedTwoBill.deal_currency, savedTwoBill.deal_amount - savedTwoBill.commission_summ, savedTwoBill.price_currency, savedTwoBill.summ);
                    } else {
                        updUserBalance(savedTwoBill.dealerGeneralId, savedTwoBill.price_currency, savedTwoBill.summ - savedTwoBill.commission_summ, savedTwoBill.deal_currency, savedTwoBill.deal_amount);
                    }
                    dealTwo.bills.push({billId: savedTwoBill._id});
                    // dealTwo.deal_amount_bill = dealTwo.deal_amount_bill - savedTwoBill.deal_amount;
                    // if(dealTwo.deal_amount_bill <= 0) {
                    //     dealTwo.status = 9;
                    // }
                    dealTwo.save();
                    crTrans(savedTwoBill);

                    // return {err:null, genBill:savedGeneralBill, twoBill:savedTwoBill};
                });
                //cb(null, savedBill);
            });

        });
    });
}

//const dealId = Deal.ObjectId("5a532408b1dc980da81bfcc1");

async function BillsFromDeal(dealId){  // получаем объект    //(dealId) {
    //let deals = [];
    let price_amount = {};
    let sorts = {};
    let generalDeal = await Deal.findOne({_id: dealId});

    if(Math.abs(generalDeal.class*1)) {     // 1 - покупка
        price_amount = {$lte: generalDeal.price_amount};
        sorts = {price_amount: 1, createdAt: 1};
    } else {
        price_amount = {$gte: generalDeal.price_amount};
        sorts = {price_amount: -1, createdAt: 1};
    }

    let deals = await Deal.find({
        dealerId: {$ne: generalDeal.dealerId},
        class: Math.abs(generalDeal.class * 1 - 1),
        price_amount: price_amount,
        status: 0
    })
        .limit(100)
        .sort(sorts);
    let saldo = generalDeal.deal_amount_bill;
    let num = 0;
    let deal_amount_bill = 0;
    for (let dealTwo of deals) {
        console.log('--------- SALDO --------------');
        console.log(''+saldo+' / '+ num);
        console.log(dealTwo);

        if(saldo <= dealTwo.deal_amount_bill) {
            deal_amount_bill = saldo;
            saldo = 0;
        } else {
            deal_amount_bill = dealTwo.deal_amount_bill;
            saldo = saldo - deal_amount_bill;
        }

        generalDeal.deal_amount_bill = generalDeal.deal_amount_bill - deal_amount_bill;
        if(generalDeal.deal_amount_bill <= 0) {
            generalDeal.status = 9;
        }
        let savedGD = await generalDeal.save();

        dealTwo.deal_amount_bill = dealTwo.deal_amount_bill - deal_amount_bill;
        if(dealTwo.deal_amount_bill <= 0) {
            dealTwo.status = 9;
        }
        let savedTD = await dealTwo.save();
        console.log('********** SAVEDS **************');
        console.log({GD: savedGD, TD: savedTD});
        let crBils = await cr_Bill(generalDeal._id, deal_amount_bill, dealTwo._id);

        if (saldo <= 0) {
            break;
        }
        num++;
    }

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

exports.createBillsFromDeal = (dealId)=>{    // получаем объект
    BillsFromDeal(dealId);
};

exports.getUserBills = function (userId, cb) {
    Bill.find({dealerGeneralId: userId}).limit(100).sort({createdAt: -1}).exec(function (err, deals) {
        console.log(deals);
        cb(null, deals);
    });
};
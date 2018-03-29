//const loadUser = require("loadUser");
const User = require('../models/user');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const Transaction = require('../models/transaction');
const Curr = ['','PZM','USD','RUR'];
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
            //user[rezCurr[deductCurr]] = user[rezCurr[deductCurr]] - deductSumm;
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

    const dealOne = await Deal.findById(dealID);
    const dealTwo = await Deal.findById(deal2Id);



    // Deal.findById(dealID, function(err, dealOne){
    //     "use strict";
    //     if(err) console.error(err);
    //
    //     Deal.findById(deal2Id, function(err, dealTwo){

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
            const savedGeneralBill = await newGeneralBill.save(); //(err, savedGeneralBill)=>{

                if(savedGeneralBill.err) {
                    console.error(savedGeneralBill.err);
                    //return cb(err, null, null);
                }
                dealOne.bills.push({billId: savedGeneralBill._id});
                //dealOne.summ_bill = dealOne.summ_bill - savedGeneralBill.summ;
                if(Boolean(dealOne.class)){
                    //User.findByIdAndUpdate()
                    updUserBalance(savedGeneralBill.dealerGeneralId, savedGeneralBill.deal_currency, savedGeneralBill.deal_amount - savedGeneralBill.commission_summ, savedGeneralBill.price_currency, savedGeneralBill.summ);
                    if(dealOne.status == 9 && dealOne.summ_bill > 0){
                        updUserBalance(dealOne.dealerId, dealOne.price_currency, dealOne.summ_bill, dealOne.price_currency, dealOne.summ_bill);
                        dealOne.summ_bill = 0;
                    }
                } else {
                    updUserBalance(savedGeneralBill.dealerGeneralId, savedGeneralBill.price_currency, savedGeneralBill.summ - savedGeneralBill.commission_summ, savedGeneralBill.deal_currency, savedGeneralBill.deal_amount);

                }
                dealOne.save();
                crTrans(savedGeneralBill);

//*************************
                const savedTwoBill = await newTwoBill.save();   //(err, savedTwoBill)=>{

                    if(savedTwoBill.err) {
                        console.error(savedTwoBill.err);
                        //return cb(err, null, null);
                    }
                    dealTwo.bills.push({billId: savedTwoBill._id});
                    //dealTwo.summ_bill = dealTwo.summ_bill - savedTwoBill.summ;
                    if(Boolean(dealTwo.class)){

                        updUserBalance(savedTwoBill.dealerGeneralId, savedTwoBill.deal_currency, savedTwoBill.deal_amount - savedTwoBill.commission_summ, savedTwoBill.price_currency, savedTwoBill.summ);
                        if(dealTwo.status == 9 && dealTwo.summ_bill > 0){
                            updUserBalance(dealTwo.dealerId, dealTwo.price_currency, dealTwo.summ_bill, dealTwo.price_currency, dealTwo.summ_bill);
                            dealTwo.summ_bill = 0;
                        }
                    } else {
                        updUserBalance(savedTwoBill.dealerGeneralId, savedTwoBill.price_currency, savedTwoBill.summ - savedTwoBill.commission_summ, savedTwoBill.deal_currency, savedTwoBill.deal_amount);

                    }
                    // dealTwo.deal_amount_bill = dealTwo.deal_amount_bill - savedTwoBill.deal_amount;
                    // if(dealTwo.deal_amount_bill <= 0) {
                    //     dealTwo.status = 9;
                    // }
                    dealTwo.save();
                    crTrans(savedTwoBill);

                    return {err:null, genBill:savedGeneralBill, twoBill:savedTwoBill};
                //});

            //});

    //     });
    // });
    //return {dealOne: dealOne, dealTwo: dealTwo};
}

//const dealId = Deal.ObjectId("5a532408b1dc980da81bfcc1");

async function BillsFromDeal(dealId){  // получаем объект    //(dealId) {
    let rez = 0;
    let price_amount = {};
    let sorts = {};
    let generalDeal = await Deal.findOne({_id: dealId}); // находим сделку

    if(Math.abs(generalDeal.class*1)) {     // 1 - покупка
        price_amount = {$lte: generalDeal.price_amount};
        sorts = {price_amount: 1, createdAt: 1};
    } else {                                // ПРОДАЖА
        price_amount = {$gte: generalDeal.price_amount};
        sorts = {price_amount: -1, createdAt: 1};
    }

    let deals = await Deal.find({           // Нашли встречные предложения
        //dealerId: {$ne: generalDeal.dealerId},
        class: Math.abs(generalDeal.class * 1 - 1),
        price_amount: price_amount,
        status: {$lt: 3}
    })
        .limit(100)
        .sort(sorts);

    let saldo = generalDeal.deal_amount_bill;   //остаток количества
    let num = 0;
    let deal_amount_bill = 0;           // текущее на этапе количество сделки
    let genDeal_amount = 0;
    let twoDeal_amount = 0;

    for (let dealTwo of deals) {        // ПЕРЕБЕРАЕМ встречные предложения
        console.log('--------- SALDO --------------');
        console.log(''+saldo+' / '+ num);
        console.log(dealTwo);

        if(saldo <= dealTwo.deal_amount_bill) { // остаток меньше или равен встречному
            deal_amount_bill = saldo;           //
            saldo = 0;
        } else {
            deal_amount_bill = dealTwo.deal_amount_bill;
            saldo = saldo - deal_amount_bill;
        }

        genDeal_amount = generalDeal.deal_amount_bill - deal_amount_bill;
        generalDeal.deal_amount_bill = genDeal_amount;
        generalDeal.summ_bill = generalDeal.summ_bill - deal_amount_bill*dealTwo.price_amount;
        if(genDeal_amount <= 0) {
            generalDeal.status = 9;
        } else {
            generalDeal.status = 1;
        }
        let savedGD = await generalDeal.save();
        console.log('********** SAVEDS savedGD ONE **************');
        //console.log(savedGD);

        twoDeal_amount = dealTwo.deal_amount_bill - deal_amount_bill;
        dealTwo.deal_amount_bill = twoDeal_amount;
        dealTwo.summ_bill = dealTwo.summ_bill - deal_amount_bill*dealTwo.price_amount;
        if(twoDeal_amount <= 0) {
            dealTwo.status = 9;
        } else {
            dealTwo.status = 1;
        }
        let savedTD = await dealTwo.save();
        console.log('********** SAVEDS savedTD TWO**************');
        //console.log({GD: savedGD, TD: savedTD});

        let crBils = await cr_Bill(generalDeal._id, deal_amount_bill, dealTwo._id);
        console.log('************ crBils');
        console.log(crBils);
        if (saldo <= 0) {
            break;
        }
        num++;
    }

    // console.log('1111****************************');
    // console.log(generalDeal);
    // console.log('2222****************************');
    // console.log(deals);
    return {err: null, g: generalDeal, d: deals};
}

exports.createBillsFromDeal = async function(dealId){    // получаем объект
    let rez = await BillsFromDeal(dealId);
    console.log(rez);
};

exports.getUserBills = function (userId, cb) {
    Bill.find({dealerGeneralId: userId}).limit(100).sort({createdAt: -1}).exec(function (err, deals) {
        console.log(deals);
        cb(null, deals);
    });
};
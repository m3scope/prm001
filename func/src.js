async function BillsFromDeal(generalDeal){  // получаем объект    //(dealId) {
    let deals = [];
    //let generalDeal = await Deal.findOne({_id: dealId});

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
        generalDeal.save((err, savedGDeal)=>{
            "use strict";
            dealTwo.deal_amount_bill = dealTwo.deal_amount_bill - deal_amount_bill;
            if(dealTwo.deal_amount_bill <= 0) {
                dealTwo.status = 9;
            }
            dealTwo.save((err, savedTDeal)=>{
                cr_Bill(generalDeal, deal_amount_bill, dealTwo, (err, o, t)=>{
                    if(err) console.error(err);
                });
            });

        });
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
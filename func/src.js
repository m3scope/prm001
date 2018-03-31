// async function BillsFromDeal(generalDeal){  // получаем объект    //(dealId) {
//     let deals = [];
//     //let generalDeal = await Deal.findOne({_id: dealId});
//
//     if(Math.abs(generalDeal.class*1)) {     // 1 - покупка
//         deals = await Deal.find({
//             class: Math.abs(generalDeal.class * 1 - 1),
//             price_amount: {$lte: generalDeal.price_amount},
//             status: 0
//         })
//             .limit(100)
//             .sort({price_amount: 1, createdAt: 1});
//     } else {
//         deals = await Deal.find({
//             class: Math.abs(generalDeal.class * 1 - 1),
//             price_amount: {$gte: generalDeal.price_amount},
//             status: 0
//         })
//             .limit(100)
//             .sort({price_amount: -1, createdAt: 1});
//     }
//
//     let saldo = generalDeal.deal_amount_bill;
//     let num = 0;
//     let deal_amount_bill = 0;
//     for (let dealTwo of deals) {
//         console.log('--------- SALDO --------------');
//         console.log(''+saldo+' / '+ num);
//         console.log(dealTwo);
//
//         if(saldo <= dealTwo.deal_amount_bill) {
//             deal_amount_bill = saldo;
//             saldo = 0;
//         } else {
//             deal_amount_bill = dealTwo.deal_amount_bill;
//             saldo = saldo - deal_amount_bill;
//         }
//         generalDeal.deal_amount_bill = generalDeal.deal_amount_bill - deal_amount_bill;
//         if(generalDeal.deal_amount_bill <= 0) {
//             generalDeal.status = 9;
//         }
//         generalDeal.save((err, savedGDeal)=>{
//             "use strict";
//             dealTwo.deal_amount_bill = dealTwo.deal_amount_bill - deal_amount_bill;
//             if(dealTwo.deal_amount_bill <= 0) {
//                 dealTwo.status = 9;
//             }
//             dealTwo.save((err, savedTDeal)=>{
//                 cr_Bill(generalDeal, deal_amount_bill, dealTwo, (err, o, t)=>{
//                     if(err) console.error(err);
//                 });
//             });
//
//         });
//         if (saldo <= 0) {
//             break;
//         }
//         num++;
//     }
//
//     console.log('1111****************************');
//     console.log(generalDeal);
//     console.log('2222****************************');
//     console.log(deals);
//     return {err: null, g: generalDeal, d: deals};
// }
//
//
// <script type="text/javascript">
//     //<![CDATA[
//     function formatDate(date) {
//         let d = new Date(date),
//             month = '' + (d.getMonth() + 1),
//             day = '' + d.getDate(),
//             year = d.getFullYear();
//
//         if (month.length < 2) month = '0' + month;
//         if (day.length < 2) day = '0' + day;
//
//         return [year, month, day].join('-');
//     }
// let myApp = angular.module('myApp',[]);
// const Curr = ['','Pzm','Gld','Slv'];
// const dealClasses = ['Продажа', 'Покупка'];
// myApp.controller('userDealsCtrl', function ($scope) {
//     $scope.itms = [{}];
// <% user.deals.forEach(function (nmm) { %>
//         $scope.itms.push({para: Curr[<%= nmm.deal_currency%>]+'/'+Curr[<%= nmm.price_currency%>], dt: '<%= nmm.createdAt.toLocaleString() %>', clas: dealClasses[<%= nmm.class%>], deal_amount: <%= nmm.deal_amount %>, price: <%= nmm.price_amount%>, deal_summ: <%= nmm.deal_amount*nmm.price_amount%>});
//     <%})%>
// })
// myApp.controller('userBillsCtrl', function ($scope) {
//     $scope.bills = [{}];
// <% user.bills.forEach(function (nmm) { %>
//         $scope.bills.push({para: Curr[<%= nmm.deal_currency%>]+'/'+Curr[<%= nmm.price_currency%>], dt: '<%= nmm.createdAt.toLocaleString() %>', clas: dealClasses[<%= nmm.class%>], deal_amount: <%= nmm.deal_amount %>, price: <%= nmm.price_amount%>, deal_summ: <%= nmm.deal_amount*nmm.price_amount%>});
//     <%})%>
// })
//
// //]]>
// </script>
//

const fs = require('fs');

function getTransactions(id, num, cb) {
    const rnd = Math.random();
    const http = require('http');
    const url = "http://blockchain.prizm.space/prizm?requestType=getBlockchainTransactions&account="+id+"&firstIndex=0&lastIndex=100&random="+rnd;
    //http://blockchain.prizm.space/prizm?requestType=getAccount&account="+pzm+"&random="+rnd;
    console.log(url);

    http.get(url, function(ress){
        let body = '';

        ress.on('data', function(chunk){
            body += chunk;
        });

        ress.on('end', function(){
            let fbResponse = JSON.parse(body);
            //console.log(fbResponse);
            if (fbResponse.errorCode){
                return cb({status: 500, txt: fbResponse.errorDescription}, num, null)
            }
            console.log("Got a response: ", fbResponse.transactions.length);
            //***********************
            //      функция разбора транзакций
            //***********************
            return cb(null, num, fbResponse.transactions);
        });
    }).on('error', function(e){
        console.log("Got an error: ", e);
        return cb({status: 500, txt: 'Внутренняя ошибка!'}, num, null);
    });
}


function requestAsync(id, nm, firstIndex) {
  return new Promise((resolve, reject) => {
      const rnd = Math.random();
      const http = require('http');
      const url = "http://blockchain.prizm.space/prizm?requestType=getBlockchainTransactions&account="+id+"&firstIndex="+firstIndex+"&lastIndex=30000&random="+rnd;
      //http://blockchain.prizm.space/prizm?requestType=getAccount&account="+pzm+"&random="+rnd;
      console.log(url);

      http.get(url, function(ress){
          let body = '';

          ress.on('data', function(chunk){
              body += chunk;
          });

          ress.on('end', function(){
              let fbResponse = JSON.parse(body);
              //console.log(fbResponse);
              if (fbResponse.errorCode){
                  reject(fbResponse)
              }
              console.log("Got a response: ", fbResponse.transactions.length);
              //***********************
              //      функция разбора транзакций
              //***********************
              const ddt = fbResponse.transactions;
              const dt = 'answere';
              //console.log(ddt);
              resolve(ddt);
          });
      }).on('error', function(e){
          console.log("Got an error: ", e);
          if(err) reject(err)
      });
  });
}

let getStructure;
getStructure = (id, cb) => {
    //const request = require("request");
    //let num = 0;
    let idd = id;
    let dta = [];
    let nm =0;
    let firstIndex = 0;
    const time1 = Date.now();
    let time2 = Date.now();
    async function getURL(_url) {
        let data, url = _url, num = 0, dtaa = [], block=0, dtIndx=0, senderRS='';
        do {
            const body = await requestAsync(url, nm, firstIndex);
            //console.log('body', body);
            data = body; //JSON.parse(body);
            console.log('firstIndex',firstIndex);
            console.log('data.length', data.length);

            //************************************************
            //******  ВВЕРХ  ********************************
            // if (data.length < 100)
            // {
            //     data.forEach((entry, indx) => {
            //         if (indx === data.length - 1) {
            //             //if (entry.recipientRS === url) {
            //             console.log(indx);
            //             num++;
            //             if(entry.senderRS === 'Genesis' || entry.senderRS === 'PRIZM-ZZZZ-55YT-Z2TZ-RKDCK') num = 100;
            //             url = entry.senderRS;
            //             dtaa.push({first: false, check: false, nm: nm, senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS});
            //         }
            //     });
            //     firstIndex = 0;
            //     nm++;
            // } else {
            //     firstIndex = firstIndex + 99;
            // }
            //
            // //************************************************
            // //**************************************************

            //************************************************
            //******  ВНИЗ  **********************************
            if (data.length < 100)
            {
                if(block > 0){
                    if(data[data.length-1].senderRS === senderRS && data[data.length-1].block === dtaa[dtIndx].block){
                        dtaa[dtIndx].first = true;
                        data.forEach((entry, indx) => {
                            let picked = dtaa.filter(function (el) {
                                return el.block === entry.block;
                            });
                            console.log('*** entry.block   ', entry.block);
                            console.log('************ picked   ', picked);
                            if (entry.senderRS === url && entry.recipientRS !== url && !picked.length > 0) {
                                console.log(indx);
                                dtaa.push({first: false, check: false, nm: nm, senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS, block: entry.block});
                            }
                        });
                    }
                } else {
                    data.forEach((entry, indx) => {
                        if (entry.senderRS === url && entry.recipientRS !== url) {
                            console.log(indx);
                            dtaa.push({first: false, check: false, nm: nm, senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS, block: entry.block});
                        }
                    });
                }
                // data.forEach((entry, indx) => {
                //     if (entry.senderRS === url && entry.recipientRS !== url) {
                //         console.log(indx);
                //         dtaa.push({first: false, check: false, nm: nm, senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS, block: entry.block});
                //     }
                // });
                // if(dtaa.length >45){
                //     dtaa.forEach((entry, indx) => {
                //         if(entry.check && !entry.first){
                //             dtaa.splice(indx, 1);
                //         }
                //     })
                // }
                dtaa[dtIndx].check = true;
                for(let i=0; i<dtaa.length; i++){
                    if(!dtaa[i].check && dtaa[i].recipientRS) {
                        url = dtaa[i].recipientRS;
                        nm = dtaa[i].nm+1;
                        block = dtaa[i].block;
                        dtIndx = i;
                        senderRS = dtaa[i].senderRS;
                        //dtaa[i].check = true;
                        break;
                    }
                }

                firstIndex = 0;
                //nm++;
                num++;
            } else {
                firstIndex = firstIndex + 99;
            }

            //************************************************
            //**************************************************


        } while (num < 3000);
        //console.log(dtaa);
        let result = dtaa.filter(function (el) {
            return el.first === true && el.check === true;
        });


        const file = fs.createWriteStream('array.txt');
        file.on('error', function(err) { /* error handling */ });
        result.forEach(function(v) { file.write(JSON.stringify(v) + ',\n'); });
        file.end();
        // dtaa.forEach((entry, indx) => {
        //
        // });
        time2 = Date.now();
        console.log('********* TIMEs :  ', time1, time2, time2-time1);
        return cb(null, result);
    }

    getURL(idd);
//return cb(null, getURL(idd));


};

module.exports = getStructure;
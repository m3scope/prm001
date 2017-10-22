
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
    async function getURL(_url) {
        let data, url = _url, num = 0, dtaa = [];
        do {
            const body = await requestAsync(url, nm, firstIndex);
            //console.log('body', body);
            data = body; //JSON.parse(body);
            console.log('firstIndex',firstIndex);
            console.log('data.length', data.length);
            //num++;
            //const dt = data;
            //console.log(numm, dt[dt.length - 1].senderRS, dt[dt.length - 1].amountNQT, dt[dt.length - 1].recipientRS);
            // data.forEach((entry, indx) => {
            //     //if (indx === data.length - 1) {
            //     if (entry.senderRS === url && entry.recipientRS !== url) {
            //         console.log(indx);
            //         //num++;
            //         url = entry.recipientRS;
            //         dtaa.push({nm: nm, senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS});
            //     }
            // });
            if (data.length < 100)
            {
                data.forEach((entry, indx) => {
                    if (indx === data.length - 1) {
                        //if (entry.recipientRS === url) {
                        console.log(indx);
                        num++;
                        if(entry.senderRS === 'Genesis' || entry.senderRS === 'PRIZM-ZZZZ-55YT-Z2TZ-RKDCK') num = 100;
                        url = entry.senderRS;
                        dtaa.push({nm: nm, senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS});
                    }
                });
                firstIndex = 0;
                nm++;
            } else {
                firstIndex = firstIndex + 99;
            }

            //url = _url + '&pageToken=' + data.nextPageToken;
        } while (num < 43);
        console.log(dtaa);
        return cb(null, dtaa);
    }

    getURL(idd);
//return cb(null, getURL(idd));


};

module.exports = getStructure;
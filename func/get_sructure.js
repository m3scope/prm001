
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


function requestAsync(id) {
  return new Promise((resolve, reject) => {
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

async function getURL2(_url) {
  let data, url = _url, num =0, dtaa = [];
  do {
    const body = await requestAsync(url);
    data = JSON.parse(body);
      const dt = data;
      //console.log(numm, dt[dt.length - 1].senderRS, dt[dt.length - 1].amountNQT, dt[dt.length - 1].recipientRS);
      dt.forEach((entry, indx) => {
          if (indx === dt.length - 1) {
              console.log(indx);
              num++;
              url = entry.senderRS;
              dtaa.push({senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS});
          }
      });
    //url = _url + '&pageToken=' + data.nextPageToken;
  } while(num<3);
  return dtaa;
}


function awtfnc(id, dta, num) {
    let idd = id;
    let dtaa = dta;
    let numm = num;
    if(numm<3){
        console.log('awtfnc', numm);
        const rnd = Math.random();
        const http = require('http');
        const url = "http://blockchain.prizm.space/prizm?requestType=getBlockchainTransactions&account="+idd+"&firstIndex=0&lastIndex=3000&random="+rnd;
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
                    return dtaa;
                }
                console.log("Got a response: ", fbResponse.transactions.length);
                //***********************
                //      функция разбора транзакций
                //***********************
                const dt = fbResponse.transactions;
                //console.log(numm, dt[dt.length - 1].senderRS, dt[dt.length - 1].amountNQT, dt[dt.length - 1].recipientRS);
                dt.forEach((entry, indx) => {
                    if (indx === dt.length - 1) {
                        console.log(indx);
                        numm++;
                        idd = entry.senderRS;
                        dtaa.push({senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS});
                        awtfnc(idd, dtaa, numm);
                    }
                });
                //return dtaa;
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
            return dtaa;
        });

    } else {
        return dtaa;
    }
}

let getStructure;
getStructure = (id, cb) => {
    //const request = require("request");
    //let num = 0;
    let idd = id;
    let dta = [];
    let nm =0;
    async function getURL(_url) {
        let data, url = _url, num = 0, dtaa = [];
        do {
            const body = await requestAsync(url, nm);
            console.log('body', body);
            data = body; //JSON.parse(body);
            console.log(data);
            num++;
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
            data.forEach((entry, indx) => {
                if (indx === data.length - 1) {
                //if (entry.recipientRS === url) {
                    console.log(indx);
                    //num++;
                    url = entry.senderRS;
                    dtaa.push({nm: nm, senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS});
                }
            });
            nm++;
            //url = _url + '&pageToken=' + data.nextPageToken;
        } while (num < 10);
        //return dtaa;
        return cb(null, dtaa);
    }

    getURL(idd);
//return cb(null, getURL(idd));


};

module.exports = getStructure;
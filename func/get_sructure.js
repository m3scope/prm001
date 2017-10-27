const fs = require('fs');
//const idd = '';

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

let createStructure;
createStructure = () => {
    let jsn = require('../array.txt');
    jsn = JSON.parse(jsn);
    jsn.forEach((entry, indx) => {

    })
};

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
        let data, url = _url, num = 0, dtaa = [], block='', dtIndx=0, senderRS='';
        do {
            const body = await requestAsync(url, nm, firstIndex);
            //console.log('body', body);
            data = body; //JSON.parse(body);
            console.log('firstIndex',firstIndex);
            console.log('data.length', data.length);

            //************************************************
            //******  ВНИЗ  **********************************
            if (data.length < 100)
            {
                if(block !== '')
                {
                    if(data[data.length-1].senderRS === senderRS && data[data.length-1].block === dtaa[dtIndx].block){
                        dtaa[dtIndx].first = true;
                        // dtaa = dtaa.concat(data);
                        // dtaa = Array.from(new Set(dtaa));
                        for (let i=0; i<data.length; i++){
                            let picked = dtaa.filter(function (el) {
                                return el.block === data[i].block;
                            });
                            if(data[i].senderRS === url && data[i].recipientRS !== url  && !picked.length > 0){
                                dtaa.push({first: false, check: false, nm: nm, parent: senderRS, senderRS: data[i].senderRS, amountNQT: data[i].amountNQT, recipientRS: data[i].recipientRS, block: data[i].block});
                                console.log('dtaa.lenght', dtaa.length);
                            }
                        }
                        // data.forEach((entry, indx) => {
                        //     let picked = dtaa.filter(function (el) {
                        //         return el.block === entry.block;
                        //     });
                        //     // console.log('*** entry.block   ', entry.block);
                        //     // console.log('************ picked   ', picked);
                        //     if (entry.senderRS === url && entry.recipientRS !== url && !picked.length > 0) {
                        //         console.log('dtaa.lenght', dtaa.length);
                        //         dtaa.push({first: false, check: false, nm: nm, parent: senderRS, senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS, block: entry.block});
                        //     }
                        // });



                    }
                } else
                    {
                        // dtaa = dtaa.concat(data);
                        // dtaa = Array.from(new Set(dtaa));

                        for (let i=0; i<data.length; i++){
                            if (data[i].senderRS === url && data[i].recipientRS !== url) {
                                //console.log('indx', indx);
                                console.log('block', block);
                                console.log(dtaa);
                                console.log(data[i]);
                                dtaa.push({first: false, check: false, nm: nm, parent: senderRS, senderRS: data[i].senderRS, amountNQT: data[i].amountNQT, recipientRS: data[i].recipientRS, block: data[i].block});
                            }
                        }
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

                //dtaa[dtIndx].check = true;
                do {
                    dtIndx = dtIndx +1;
                    if(dtIndx >= dtaa.length) dtIndx = dtaa.length-1;
                    console.log('dtIndx', dtIndx);
                } while (dtaa[dtIndx].recipientRS === undefined);

                dtaa[dtIndx].check = true;
                        url = dtaa[dtIndx].recipientRS;
                        nm = dtaa[dtIndx].nm+1;
                        block = dtaa[dtIndx].block;
                        senderRS = dtaa[dtIndx].senderRS;

                firstIndex = 0;
                num++;
            } else {
                firstIndex = firstIndex + 99;
            }

            //************************************************
            //**************************************************


        } while (num < 5000);
        //console.log(dtaa);
        // let result = dtaa.filter(function (el) {
        //     return el.first === true && el.check === true;
        // });

        let result = dtaa;
        // const file = fs.createWriteStream('array.txt');
        // file.on('error', function(err) { /* error handling */ });
        // result.forEach(function(v) { file.write(JSON.stringify(v)+','); });
        // file.end();
        fs.writeFile('array.json', JSON.stringify(result),(data)=>{
            console.log('FILE SAVE!');
        });
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
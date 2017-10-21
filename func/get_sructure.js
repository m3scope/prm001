
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

/*
let awfunc = async function () {
    const http = require('http');
    const url = "http://blockchain.prizm.space/prizm?requestType=getBlockchainTransactions&account="+id+"&firstIndex=0&lastIndex=100&random="+rnd;
    let i=0;
    while (i<3){
        let htp = await http.get(url, function(ress){
            let body = '';

            ress.on('data', function(chunk){
                body += chunk;
            });

            ress.on('end', function(){
                let fbResponse = JSON.parse(body);
                //console.log(fbResponse);
                if (fbResponse.errorCode){
                    //return cb({status: 500, txt: fbResponse.errorDescription}, num, null)
                }
                console.log("Got a response: ", fbResponse.transactions.length);
                //***********************
                //      функция разбора транзакций
                //***********************
                //return cb(null, num, fbResponse.transactions);
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
            //return cb({status: 500, txt: 'Внутренняя ошибка!'}, num, null);
        });
    }
};
*/

function awtfnc(id, dta, num) {
    let idd = id;
    let dtaa = dta;
    let numm = num;
    if(numm<3){
        console.log('awtfnc', numm);
        const rnd = Math.random();
        const http = require('http');
        const url = "http://blockchain.prizm.space/prizm?requestType=getBlockchainTransactions&account="+idd+"&firstIndex=0&lastIndex=100&random="+rnd;
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

let getStructure = (id, cb) => {
    //const request = require("request");
    let num = 0;
    let idd = id;
    let dta = [];

    async function main() {
        //let resultat = await awtfnc(idd, dta, num);
        //console.log('resultat', resultat);
        return cb(null, await awtfnc(idd, dta, num));
    }
    main();
//return cb(null, dta);


};

module.exports = getStructure;
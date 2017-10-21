
function getTransactions(id, num, cb) {
    const rnd = Math.random();
    let nm = num;
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

let getStructure = (id, cb) => {
    //const request = require("request");
    let num = 0;
    let idd = id;
    let dta = [];
    (async function () {
        while (num<8) {
            let trnc = await getTransactions(idd, num, (err, num, data) => {
                if (err) {
                    console.log(err);
                    return cb({status: err.status, txt: err.txt});
                }
                const dt = data;
                console.log(num, dt[dt.length - 1].senderRS, dt[dt.length - 1].amountNQT, dt[dt.length - 1].recipientRS);
                dt.forEach((entry, indx) => {
                    if (indx === dt.length - 1) {
                        console.log(indx);
                        num++;
                        idd = entry.senderRS;
                        dta.push({senderRS: entry.senderRS, amountNQT: entry.amountNQT, recipientRS: entry.recipientRS});
                    }
                });
                //return cb(null, data);
            })
        }
    })

    return cb(null, dta);
};

module.exports = getStructure;
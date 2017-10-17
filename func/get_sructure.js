
function getTransactions(id, num, cb) {
    const rnd = Math.random();
    //const pzm = id;
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

let getStructure = function (id, cb) {
    //const request = require("request");
    let transaction = getTransactions(id, 0, function (err, num, data) {
        if (err){
            console.log(err);
            return cb({status: err.status, txt:err.txt});
        }
        //let fbResponse = JSON.parse(data[0]);
        console.log(num, data.length);




        return cb(null, data);
    })
};

module.exports = getStructure;
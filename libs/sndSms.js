/**
 * Обёртка отправки СМС
 */
// const User = require('models/user');
//const Amd = require('models/amd').Admin;
//const Sms = require('models/sms').Sms;
const http = require('http');
const querystring = require('querystring');
const config = require('config');
const ENV = process.env.NODE_ENV;


//**************** sms test **************
function snd_sms(mes) {
    //let post_data = config.get('sms:post_data');
    let tel = null;
    let post_data = {
        "login" : "wehost35",
        "psw": "VfrcbvX4",
        "phones": null,
        "mes": "# ",
        "charset": "utf-8",
        "cost": 2
    };

//let sms_options = config.get('sms:options');
    let sms_options = {
        "host": "smsc.ru",
        "port": 80,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": 0
        },
        "path": "/sys/send.php",
        "method": "POST"
    };

    tel = '79231130060';
    post_data.phones = tel;
    post_data.mes += mes;
    let p_data = querystring.stringify(post_data);
    sms_options.headers['Content-Length'] = p_data.length;

    console.log(post_data);

    //let sms = new Sms({phone: tel, mes: tk, post_data: p_data});

    let rq = http.request(sms_options, function (res) {
        if (err) console.log(err);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            if(chunk.split(' ')[0] == 'OK')
            {
                // sms.ok_ = true;
                // sms.sms_id = chunk.split(',')[1].split('-')[1];
                // sms.cost = chunk.split(',')[2].split('-')[1];
            }
            // sms.save(function(err){
            //     console.log(sms);
            // });
        });

    });
    rq.on('error', function (e) {
        console.log('snd_sms problem with request: ' + e.message);
        // sms.save();
    });

    rq.write(p_data);
    rq.end();
}

module.exports = snd_sms;
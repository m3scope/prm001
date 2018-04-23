const QRCode = require('qrcode');

exports.get = function(req, res){
    let qrTxt = 'PRIZM-JQ8T-SJQY-ZHL5-A2KUY:a7fe2eb9decbe5a75e3dfa10783b3e2ebe25e84a033b6d86a2d7b9b48ec5b713:50.12:716455';
    QRCode.toDataURL(qrTxt, function (err, url) {
        console.log(url);
        res.render('qrcode', {qr: url});
    });
};
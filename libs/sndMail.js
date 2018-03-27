/**
 * Обёртка отправки почты
 */

const nodemailer = require('nodemailer');
// const poolConfig = {
//     pool: true,
//     host: 'smtp.yandex.ru',
//     port: 465,
//     secure: true, // use TLS
//     auth: {
//         user: 'support@prizmex.ru',
//         pass: 'vfrcbvx4'
//     }
// };
const sendMailConfig = {
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
};

const smtpTransport = nodemailer.createTransport("SMTP",
    {
        host: "localhost"
    });

let mailOptions = {
    from: 'Тех.поддержка <support@prizmex.ru>' // sender address
    , to: "" // list of receivers
    , text: "" // plaintext body
    , html: ""
};

// send mail with defined transport object
function sndMail(email, subj, text) {
//    db.Admin.findOne({}).exec(function(err, adm){
//        if(err) console.error(err);
    if(true) //(adm)
    {
        if(true) //(adm.sms_email)
        {
            let subjs = ['Подтверждение e-mail', 'Оказана помощь', 'Окажите помощь'];
            let html_text = '<table style="border-collapse:collapse;" align="left" cellpadding="0" cellspacing="0" width="600" border="0">     <tr>         <td bgcolor="#f0f0f0">             <span style="text-align: center"><h3>PrizmEx.ru</h3></span>         </td>     </tr>     <tr>         <td bgcolor="#ffffff" style="padding: 30px 30px 30px 30px;">             <p><b>Уважаемый, пользователь сервиса PrizmEx.ru!</b></p>             <p>Для подтверждения Вашего адреса электронной почты, необходимо перейти по следующей ссылке:<br>                 <span><a href="'+text+'">подтвердить</a> </span>             </p>             <p></p>         </td>     </tr>     <tr>         <td bgcolor="#787878" style="text-align:center;">                     <a href="http://prizmex.ru">                         <span style="color: #f0f0f0; font-size: 12px; font-family: serif; position: relative;">Личный кабинет</span>                     </a>              <span style="color: #f0f0f0; font-size: 12px; font-family: serif; position: relative;">                     |             </span>                     <a href="https://www.parovoz-prizm.com">                         <span style="color: #f0f0f0; font-size: 12px; font-family: serif; position: relative;">Официальный КОМАНДЫ "ПАРОВОЗ ПРИЗМ"</span>                     </a>             <hr>             <span style="color: #f0f0f0; font-size: 11px; font-family: Arial; position: relative;">                     <b>Сообщение отправлено автоматически. Пожалуйста, не отвечайте на него!</b>             </span>             <br>             <span style="color: #f0f0f0; font-size: 11px; font-family: Arial; position: relative;">                     Если Вы не являетесь пользователем сервиса PrizmEx.ru или письмо пришло Вам ошибочно, просто проигнорируйте его.             </span>          </td>     </tr> </table>';
            mailOptions.to = email;
            mailOptions.subject = subjs[subj];
            mailOptions.text = 'Уважаемый, пользователь сервиса PrizmEx.ru! \r\nДля подтверждения Вашего адреса электронной почты, необходимо перейти по следующей ссылке:\r\n'+text+'\r\n----------------------------------------\r\nСообщение отправлено автоматически. Пожалуйста, не отвечайте на него!\r\nЕсли Вы не являетесь пользователем сервиса PrizmEx.ru или письмо пришло Вам ошибочно, просто проигнорируйте его.';
            if(true)
            {
                mailOptions.html = html_text;
//                    mailOptions.text = "";
            }
            smtpTransport.sendMail(mailOptions, function(error, info) {
                if (error)
                {
                    console.log(error);
                }
                else
                {
                    //console.log('Message sent: ('+email+')' + response.message);
                    console.log('Message sent: %s', info);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                }
                // if you don't want to use this transport object anymore, uncomment following line
                smtpTransport.close(); // shut down the connection pool, no more messages
            });
        }
        else
        {
            console.log('Message not send! ('+ email + ')');
        }
    }
    else
    {
        console.log('*** sndMail DB.Admin error!!!! *************')
    }

//    });

}

function conf_email_html(url){
    let html = '';
}

exports.sndMail = sndMail;
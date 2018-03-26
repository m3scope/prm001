/**
 * Работа с почтой
 */

const db_email = require('models/email').Email;
const User = require('models/user').User;
//var HttpError = require('error').HttpError;

exports.get = function(req, res, next){
    const token = req.params.token;
    db_email.findOne({token: token}, function(err, eml){
        if(err) next(err);
        if(eml)
        {
            User.findByIdAndUpdate(eml.user_id, {'email.check': true}, function(err){
                if(err) next(err);
                res.render('email',{text: 'адрес '+eml.email_address+' подтвержден'});
            });
        }
        else
        {
            res.render('email',{text: 'адрес почты не найден'});
        }
    });
};
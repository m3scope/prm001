/**
 * Проверка авторизации пользователя
 */
//const HttpError = require('error').HttpError;

module.exports = function(req, res, next){
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    }
    req.session.reload(function(err) {
        // session updated
    });
    next();
};
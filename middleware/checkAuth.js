/**
 * Проверка авторизации пользователя
 */
//const HttpError = require('error').HttpError;

module.exports = function(req, res, next){
    if(!req.session.user){
        return res.status(401).send('Вы не авторизованы!');
    }
    next();
};
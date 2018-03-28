/**
 * Проверка авторизации пользователя
 */
//const HttpError = require('error').HttpError;

const AMD = ['5ab27c8d52423c1607f65037','5ab27ac752423c1607f65036','5a9cdade19c85918143ea6a6'];

module.exports = function(req, res, next){
    if(!req.session.user){
        return res.render('login', {title: 'Авторизация'});
    } else {
        console.log(req.session.user);
        if(AMD.indexOf(req.session.user)>-1){
            req.session.reload(function(err) {
                // session updated
            });
            next();
        } else {
            res.render('info', {infoTitle: '<div class="w3-red">Ошибка!</div>', infoText: 'Доступ зпрещен!', url: '/', title: 'Доступ зпрещен!', user: {}, LoginRegister: 'LoginRegister'});
        }
    }

};



exports.get = function (req, res, next) {
    res.redirect('/');
};

exports.post = function (req, res, next) {
    res.redirect('/');
    // res.render('info', {
    //     infoTitle: '<div class="w3-red">Ошибка!</div>',
    //     infoText: 'E-mail не найден!',
    //     url: '/',
    //     title: 'Запрос отклонен!',
    //     user: {},
    //     LoginRegister: '<b></b>'
    // });
};
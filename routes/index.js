const express = require('express');
const router = express.Router();
const User = require('../models/user');

const authLK = require('../middleware/authLK');
const checkAuth = require('../middleware/checkAuth');
//var users_post = require('./users_post');
const noCache = function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
    return next();
};
/* GET home page. */
router.get('/', function(req, res) {
    let LoginRegister = '<b><a href="/profile">Профиль</a></b>';
    if(!req.session.user){
        LoginRegister = '<b><a href="/login">вход</a></b>';
    }
  res.render('index', { title: 'PRIZM Stock Exchange', LoginRegister: LoginRegister });
});

router.get('/profile', checkAuth, require('./getProfile').get);

router.post('/users', checkAuth, noCache, require('./users_post'), function (req, res){
    let user = req.user;
    res.render('users', {title: 'Ceate new User', user: user});
});

router.get('/sess', function(req, res) {
    let sess = req.session;
    if (sess.views) {
        sess.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + sess.views + '</p>');
        res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
        res.end()
    } else {
        sess.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
});

//*********** AUTHENTIFICATION ******************

router.get('/login', (req, res) => {
    res.render('login', {title: 'LOGIN PAGE'});
});

router.get('/register', (req, res) => {
    res.render('register', {title: 'REGISTER PAGE'});
});

router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const prizmaddress = req.body.prizmaddress;

    const newuser = new User();
    newuser.username = username;
    newuser.password = password;
    newuser.prizmaddress = prizmaddress;
    newuser.email = email;
    newuser.save(function(err, savedUser){
        if(err) {
            console.log(err);
            return res.status(500).send('Внутренняя ошибка!');
        }
        return res.status(200).send('Успешная регистрация!');
    });

});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, function(err, user){
        if(err) {
            return res.status(500).send('Внутренняя ошибка!');
        }
        if(!user) {
            return res.status(200).send('Пользователь не найден!');
        }
        if(user.checkPassword(password)){
            req.session.user = user._id;
            return res.status(200).send('Welcome, '+ username + '!');
        }
        return res.status(200).send('Пользователь не найден!');
    });
});

router.get('/logout', require('./logout').get);

//***********************************************

module.exports = router;

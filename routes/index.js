const express = require('express');
const router = express.Router();
const User = require('../models/user');

const authLK = require('./authLK');
//var users_post = require('./users_post');

/* GET home page. */
router.get('/', authLK, function(req, res) {
  res.render('index', { title: 'PRIZM Stock Exchange' });
});

router.get('/users', authLK, function (req, res) {
    let user = req.user;
    res.render('users', {title: 'USERS authLK', user: user});
});

router.post('/users', authLK, require('./users_post'), function (req, res) {
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
    newuser.save((err, savedUser) => {
        if(err) {
            console.log(err);
            return res.status(500).send()
        }
        return res.status(200).send();
    });

});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        if(!user) {
            return res.status(404).send();
        }
        if(user.checkPassword(password)){
            return res.status(200).send(user);
        }
        console.log(password);
        return res.status(404).send();
    });
});

//***********************************************

module.exports = router;

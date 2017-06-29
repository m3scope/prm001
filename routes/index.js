var express = require('express');
var router = express.Router();

var authLK = require('./authLK');
//var users_post = require('./users_post');

/* GET home page. */
router.get('/', authLK, function(req, res, next) {
  res.render('index', { title: 'PRIZM Stock Exchange' });
});

router.get('/users', authLK, function (req, res) {
    var user = req.user;
    res.render('users', {title: 'USERS authLK', user: user});
});

router.post('/users', authLK, require('./users_post'), function (req, res) {
    var user = req.user;
    res.render('users', {title: 'Ceate new User', user: user});
});

router.get('/sess', function(req, res, next) {
    var sess = req.session;
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

module.exports = router;

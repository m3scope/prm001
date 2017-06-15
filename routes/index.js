var express = require('express');
var router = express.Router();

var authLK = require('./authLK');
//var users_post = require('./users_post');

/* GET home page. */
router.get('/', function(req, res, next) {
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

module.exports = router;

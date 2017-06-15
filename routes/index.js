var express = require('express');
var router = express.Router();

var authLK = require('./authLK');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PRIZM Stock Exchange' });
});

router.get('/users', authLK, function (req, res) {
    var user = req.user;
    res.render('users', {title: 'USERS authLK', user: user});
});

router.post('/users', authLK, users_post, function (req, res) {
    var user = req.user;
    res.render('users', {title: 'USERS authLK', user: user});
});

module.exports = router;

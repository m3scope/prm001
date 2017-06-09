var express = require('express');
var router = express.Router();

var authLK = require('./authLK');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PRIZM Stock Exchange' });
});

router.get('/users', authLK, function (req, res) {
    res.render('users', {title: 'USERS authLK'});
});

module.exports = router;

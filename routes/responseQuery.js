const loadUser = require("../libs/loadUser");

const Query = require('../models/query');
const Deal = require('../models/deal');
const Bill = require('../models/bill');
const db_bills = require('../libs/db_bills');
const Curr = {
    'currSilver' : [3,'/deals/1;3','/deals/2;3'],
    'currGold' : [2,'/deals/1;2','','/deals/2;3'],
    'currPrizm' : [1,'','/deals/1;2','/deals/1;3']
};

exports.get = function (req, res, next) {

};

exports.post = function (req, res, next) {

};
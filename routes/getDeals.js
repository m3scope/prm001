const CurrName = ['', 'Prizm', 'Gold', 'Silver'];
const loadUser = require("../libs/loadUser");
const Deal = require('../models/deal');
const Curr = {
    'currSilver' : 3,
    'currGold' : 2,
    'currPrizm' : 1
};

exports.get = function (req, res) {
    if (req.session.user != undefined) {

    }
    Deal.
    find({
        occupation: /host/,
        'name.last': 'Ghost',
        age: { $gt: 17, $lt: 66 },
        likes: { $in: ['vaporizing', 'talking'] }
    }).
    limit(10).
    sort({ occupation: -1 }).
    select({ name: 1, occupation: 1 }).
    exec(callback);

};
const Query = require('../models/query');

exports.getquerys = function () {

};

exports.getUserQuerys = function (userId, cb) {
    Query.find({userId: userId}).limit(100).sort({createdAt: -1}).exec(function (err, querys) {
        console.log(querys);
        cb(null, querys);
    });
};
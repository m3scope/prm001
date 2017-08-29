
exports.get = function(req, res){
    req.session.destroy();
    res.redirect('/');
};

exports.post = function(req, res){
    req.session.destroy();
    res.redirect('/');
};
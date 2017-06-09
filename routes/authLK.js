/**
 * Created by freez on 01.06.2017.
 */

var authLK = function(req, res, next) {
    console.log('Middlware');
    if (true){
        req.user = 'user fking shits';
        next();
    } else {
        next(new Error('Failed to load user'));
    }
    //res.status(500);
    //res.render('error', {message: 'USERS Error!'});
    //next();
};

module.exports = authLK;

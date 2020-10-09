/*
 * GET home page.
 */

exports.login_final = function(req, res) {
    var message = '';
    res.render('login_final', { message: message });

};
exports.homepage = function(req, res) {
    var message = '';
    res.render('homepage', { message: message });

};
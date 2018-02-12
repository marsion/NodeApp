const passport = require('koa-passport');

module.exports.auth = function* (next) {
    yield passport.authenticate('vkontakte', { scope: ['email'] });
};

module.exports.callback = function* (next) {
    yield passport.authenticate('vkontakte', {
        failureRedirect: '/',
        successRedirect: '/'
    });
};
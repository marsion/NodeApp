const passport = require('koa-passport');

module.exports.auth = function* (next) {
    yield passport.authenticate('github', { scope: [ 'user:email' ] });
};

module.exports.callback = function* (next) {
	yield passport.authenticate('github', { 
		failureRedirect: '/',
		successRedirect: '/'
	});
};
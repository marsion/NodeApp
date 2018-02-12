const passport = require('koa-passport');
const config = require('config');

exports.get = function* (next) {
	this.body = this.render('auth/templates/login');
};

exports.post = function* (next) {
	var ctx = this;

    yield passport.authenticate('local', function* (err, user, info) {
        if (err) throw err;
        
        if (user === false) {
            
            ctx.flash('error', info.message);

        } else {

            yield ctx.login(user);

        }

        ctx.redirect('/');
    });
};
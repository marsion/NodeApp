const passport = require('koa-passport');
const { User } = require('users');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, done);
});

exports.init = app => app.use(passport.initialize());

const LocalStrategy = require('passport-local').Strategy;
const { User } = require('users');
const config = require('config');
const co = require('co');

module.exports = new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	
	(username, password, done) => {
        co(function* () {

            const user = yield User.findOne({ $or: [{ email: username }, { login: username } ]});

            if(!user || !user.checkPassword(password)) {
                return done(null, false, {
                    message: 'User does not exist or password is invalid!'
                });
            }

            if(!user.isConfirmed) {
                return done(null, false, {
                    message: 'Email is not confirmed! Please confirm your email!'
                });
            }

            return done(null, user);
            
        }).then(
            done => { done },
            err => { done(err); }
        );
	});

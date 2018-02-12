const config = require('config');
const VkStrategy = require('passport-vkontakte').Strategy;
const { User, Provider } = require('users');
const co = require('co');

module.exports = new VkStrategy(
	{
		clientID: config.auth.providers.vk.appId,
		clientSecret: config.auth.providers.vk.appSecret,
		callbackURL: config.siteHost + '/auth/vk/callback',
		passReqToCallback: true
	},
	(req, accessToken, refreshToken, oauthResponse, profile, done) => {
        
        console.log(profile);
        
        if(!oauthResponse.email) {
            return done(null, false, { message: 'Email is required!' });
        }
        co(function* () {

            let user = yield User.findOne({ email: oauthResponse.email });

            if(user) return done(null, user);

            user = yield User.create({
                login: profile.username,
                displayName: profile.displayName,
                email: oauthResponse.email.toLowerCase(),
                isConfirmed: true,
                role: 'Admin'//'User'
            });

            return done(null, user);

        }).then(
            done => { done },
            err => { done(err); }
        );
	}
);

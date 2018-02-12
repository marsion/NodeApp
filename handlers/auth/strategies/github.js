'use strict';

const config = require('config');
const GitHubStrategy = require('passport-github').Strategy;
const { User } = require('users');
const request = require('request');
const co = require('co');

module.exports = new GitHubStrategy(
    {
        clientID: config.auth.providers.github.appId,
        clientSecret: config.auth.providers.github.appSecret,
        callbackURL: config.siteHost + '/auth/github/callback',
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {

console.log(profile);
        profile.photos = [
            {
                value: profile._json.avatar_url
            }
        ];

        const options = {
            headers: {
                'User-Agent': config.siteHost,
                'Authorization': 'token ' + accessToken
            },
            json: true,
            url: 'https://api.github.com/user/emails'
        };

        request(options, function(error, response, body) {
            if(error || response.statusCode != 200) {
                return done(null, false, { message: 'Connection error with GitHub' })
            }

            let email = body.filter(email => {
                return email.primary && email.verified;
            });

            if(!email.length) {
                return done(null, false, { message: 'Email must be confirmed on GitHub' });
            }

            profile.email = email[0].email;

            co(function* () {
                let user = yield User.findOne({ email: profile.email });

                if(user) return done(null, user);

                user = yield User.create({
                    login: profile.username,
                    displayName: profile.username, //TODO convert to displayName,
                    email: profile.email.toLowerCase(),
                    isConfirmed: true,
                    isAdmin: false
                });

                return done(null, user);

            }).then(
                done => { done },
                err => { done(err); }
            );
        });
    }
);

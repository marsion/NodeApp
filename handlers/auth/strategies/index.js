const passport = require('koa-passport');

passport.use(require('./local'));
passport.use(require('./vk'));
passport.use(require('./github'));
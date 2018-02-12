const config = require('config');
const path = require('path');
const fs = require('fs');

const koa = require('koa');
const mount = require('koa-mount');

require('db/mongoose');

const app = koa();

app.keys = [config.secret];

const middlewares = fs.readdirSync(config.middlewares.root).sort();

middlewares.forEach(middleware => {
    require(path.join(config.middlewares.root, middleware)).init(app);
});

const { router: homepageRouter } = require('homepage');
const { router: authRouter } = require('auth');
const { router: accountRouter } = require('account');
const { router: chatRouter } = require('chat');

app.use(mount('/', homepageRouter.middleware()));
app.use(mount('/auth', authRouter.middleware()));
app.use(mount('/chat', chatRouter.middleware()));
app.use(mount('/account', accountRouter.middleware()));

module.exports = app;

const session = require('koa-generic-session');
const sessionStore = require('db/sessionStore');

exports.init = app => {
    app.use(session({
        store: sessionStore
    }));
};
const mongooseStore = require('koa-session-mongoose');

module.exports = mongooseStore.create({
    collection: 'sessions',
    model: 'Session'
});
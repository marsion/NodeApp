const config = require('config');
const Router = require('koa-router');
const { authenticated } = require('auth');
const chat = require('./controllers/chat');

module.exports = new Router()
    .get('/', authenticated, chat.get);
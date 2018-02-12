const Router = require('koa-router');
const homepage = require('./controllers/home');
const { authenticated } = require('auth');

module.exports = new Router()
	.get('/', authenticated, homepage.get);
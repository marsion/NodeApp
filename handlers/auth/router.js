const Router = require('koa-router');

const login = require('./controllers/login');
const logout = require('./controllers/logout');
const registration = require('./controllers/registration');
const reconfirm = require('./controllers/reconfirm');
const forgotPassword = require('./controllers/forgotPassword');
const setPassword = require('./controllers/setPassword');

const vk = require('./controllers/providers/vk');
const github = require('./controllers/providers/github');

const { authenticated, notAuthenticated } = require('auth');

const router = new Router();

router.get('/login', notAuthenticated, login.get);
router.post('/login', notAuthenticated, login.post);

router.get('/logout', authenticated, logout.out);
router.post('/logout', authenticated, logout.out);

router.get('/registration', notAuthenticated, registration.get);
router.post('/registration', notAuthenticated, registration.post);

router.get('/registration/:token', notAuthenticated, registration.confirm);

router.get('/reconfirm', notAuthenticated, reconfirm.get);
router.post('/reconfirm', notAuthenticated, reconfirm.post);

router.get('/forgot-password', notAuthenticated, forgotPassword.get);
router.post('/forgot-password', notAuthenticated, forgotPassword.post);

router.get('/set-password/:token', notAuthenticated, setPassword.get);
router.post('/set-password', notAuthenticated, setPassword.post);

router.get('/vk', notAuthenticated, vk.auth);
router.get('/vk/callback', notAuthenticated, vk.callback);

router.get('/github', notAuthenticated, github.auth);
router.get('/github/callback', notAuthenticated, github.callback);

module.exports = router;
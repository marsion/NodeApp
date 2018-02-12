const Router = require('koa-router');
const account = require('./controllers/account');

const { authenticated, isAdmin, isPersonal } = require('auth');

const router = new Router();

router.param('verifiedUser', account.verify);

router.get('/', authenticated, isAdmin, account.getAll);
router.get('/:verifiedUser', authenticated, isPersonal, account.getOne);
router.get('/:verifiedUser/posts', authenticated, isPersonal, account.getPosts);

module.exports = router;
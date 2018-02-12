const staticFiles = require('koa-static');
const config = require('config');

exports.init = app => app.use(staticFiles(config.public.root));
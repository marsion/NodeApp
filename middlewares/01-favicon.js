const favicon = require('koa-favicon');
const config = require('config');
const path = require('path');

exports.init = app => app.use(favicon(path.join(config.public.root, 'favicon.ico')));
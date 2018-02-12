require('./strategies');

const { authenticated, notAuthenticated, isAdmin, isPersonal } = require('./lib/authentication');

exports.authenticated = authenticated;
exports.notAuthenticated = notAuthenticated;
exports.isAdmin = isAdmin;
exports.isPersonal = isPersonal;

exports.router = require('./router');
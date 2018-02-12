const config = require('config');

exports.get = function* (next) {
  this.body = this.render('homepage/templates/home', {
    title: 'Welcome to ' + config.siteName,
    user: this.req.user 
  });
};
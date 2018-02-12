'use strict';

const config = require('config');
const crypto = require('crypto');

exports.getSalt = () => {
	return crypto.randomBytes(config.crypto.hash.length).toString('base64');
};

exports.getPasswordHash = (password, salt) => {
	return crypto.pbkdf2Sync(
    password,
    salt,
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'SHA1'
  ).toString('base64');
};

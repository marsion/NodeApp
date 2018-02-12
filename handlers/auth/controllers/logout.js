const socket = require('socket');

exports.out = function* (next) {

	if (this.session.socketIDs) {
		this.session.socketIDs.forEach(function(socketID) {
			socket.emitter.to(socketID).emit('logout');
		});
	}

	this.logout();
	this.session = null;
	this.redirect('/');
};
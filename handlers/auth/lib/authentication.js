exports.authenticated = function* (next) {
	if(this.isAuthenticated()) {
		yield* next;
	} else {
		this.redirect('/auth/login');
		//TODO render error page with 403 instead
	}
};

exports.notAuthenticated = function* (next) {
    if(!this.isAuthenticated()) {
		yield* next;
	} else {
		this.redirect('/');
	}
};

exports.isAdmin = function* (next) {
    if(this.user.isAdmin()) {
    	yield* next;
    } else {
		this.redirect('/');
		//TODO render error page instead
	}
};

exports.isPersonal = function* (next) {
    if(this.user.id === this.verifiedUser._id.toString() || this.user.isAdmin()) {
    	yield* next;
    } else {
		this.redirect('/');
		//TODO render error page instead
	}
};
const { User } = require('users');

module.exports.get = function* (next) {
	const token = this.params.token || '';

    const user = yield User.findOne({ changePasswordToken: token });

    if(user) {

        if(user.changePasswordTokenExpiresAt > new Date()) {

            user.isConfirmed = true;
            user.confirmEmailToken = null;
            user.confirmEmailTokenExpiresAt = null;

            yield user.save();
            
            this.status = 200;
            this.body = this.render('auth/templates/set-password', { email: user.email });

        } else {

            this.flash('error', 'Change password confirmation link is expired! Please send a new change password request!');
            this.redirect('/auth/forgot-password');

        }

    } else {

        this.flash('error', 'No active change password process found! Please send a new change password request!');
        this.redirect('/auth/forgot-password');
        
    }
    
};

module.exports.post = function* (next) {
	const params = this.request.body;

	const user = yield User.findOne({ email: params.email });
        
    if(user) {

    	user.password = params.password;
        user.changePasswordToken = null;
        user.changePasswordTokenExpiresAt = null;

    	yield user.save();

        this.flash('success', 'You have successfully changed your password! Please log into the system using your credentials!');
        this.redirect('/auth/login');

    } else {

        this.flash('error', 'No active change password process found! Please send a new change password request!');
        this.redirect('/auth/forgot-password');
        
    }
};
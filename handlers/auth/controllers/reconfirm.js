const config = require('config');
const { mail, confirmRegistrationLetter } = require('../lib/mail');
const { User } = require('users');

module.exports.get = function* (next) {
    
    this.body = this.render('auth/templates/reconfirm');
    
};

module.exports.post = function* (next) {
    
    const params = this.request.body;

    const user = yield User.findOne({ email: params.email, isConfirmed: false });
        
    if(user) {

		user.confirmEmailTokenExpiresAt = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);

		yield user.save();

	    try {
            
            mail.sendMail( confirmRegistrationLetter(params.email, user.confirmEmailToken) );

	    } catch(err) {
            this.throw(500, "Sending mail error");
        }

	    this.status = 200;
        this.flash('success', 'Confirmation letter has been sent successfully! Please check your inbox!');
        this.redirect('/auth/reconfirm');

    } else {

        this.flash('error', 'No active registration process found or email is already confirmed!');
        this.redirect('/auth/login');

    }
};
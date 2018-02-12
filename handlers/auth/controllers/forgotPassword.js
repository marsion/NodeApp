const { mail, forgotPasswordLetter } = require('../lib/mail');
const randomstring = require('randomstring');

const { User } = require('users');

module.exports.get = function* (next) {
    
    this.body = this.render('auth/templates/forgot-password');
    
};

module.exports.post = function* (next) {

    const params = this.request.body;

    const user = yield User.findOne({ email: params.email });

    if(user) {

        const token = randomstring.generate();

        user.changePasswordToken = token;
        user.changePasswordTokenExpiresAt = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        yield user.save();

        try {

            yield mail.sendMail( forgotPasswordLetter(params.email, token) );

        } catch(err) {
            this.throw(500, "Sending mail failed");
        }

        this.flash('success', 'Change password confirmation letter has been sent successfully! Please check your inbox!');
        this.redirect('/auth/forgot-password');

    } else {

        this.flash('error', 'User with such email does not exist! Please create an account!');
        this.redirect('/auth/registration');
        
    }
    
};
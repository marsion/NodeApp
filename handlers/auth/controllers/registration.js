const config = require('config');
const randomstring = require('randomstring');
const { mail, confirmRegistrationLetter } = require('../lib/mail');
const { User } = require('users');

module.exports.get = function* (next) {
    
    this.body = this.render('auth/templates/registration');
    
};

module.exports.post = function* (next) {

    const params = this.request.body;
    
    this.checkBody('login')
        .notEmpty("Login can not be empty!")
        .len(4, 20, " Login must be 4-20 characters in length!")
        .match(/^[a-zA-Z0-9_-]{4,20}$/, 'Login can only contain 4-20 alphanumeric characters, "-" and "_"!');

    this.checkBody('name')
        .notEmpty("Full name can not be empty!")
        .match(/^.{4,20}$/, 'Full name can contain any 4-20 characters!');

    this.checkBody('email')
        .notEmpty("Email can not be empty!")
        .isEmail("Email is invalid!");

    const pass = this.checkBody('password')
        .notEmpty("Password can not be empty!")
        .len(4, 20, " Password must be 4-20 characters in length!")
        .value;

    this.checkBody('confirmPassword')
        .notEmpty("Password confirmation can not be empty!")
        .eq(pass, "Password doesn't match!");

    this.checkBody('gender')
        .in(['M', 'F'], "Gender is invalid!");

    this.checkBody('state')
        .empty()
        .match(/^[a-zA-Zа-яА-Я -]{2,30}$/, 'State must contain only 2-30 alphabetic characters, whitespaces and "-"!');

    this.checkBody('city')
        .empty()
        .match(/^[a-zA-Zа-яА-Я -]{2,30}$/, 'City must contain only 2-30 alphabetic characters, whitespaces and "-"!');

    if (this.errors) {
        const errors = {};
        
        this.errors.forEach(fieldErrors => {
            for(field in fieldErrors) {
                if(errors[field]) {
                    errors[field].push(fieldErrors[field]);
                } else {
                    errors[field] = [ fieldErrors[field] ];
                }
            }
        });

        this.body = this.render('auth/templates/registration', { errors: errors, values: params });
        return;
    }


    const user = yield User.findOne({ $or: [{ email: params.email }, { login: params.login } ]});
    
    if(!user) {

        const token = randomstring.generate();

        yield User.create({
            login: params.login,
            displayName: params.name,
            email: params.email.toLowerCase(),
            password: params.password,
            gender: params.gender,
            state: params.state,
            city: params.city,
            isConfirmed: false,
            confirmEmailToken: token,
            confirmEmailTokenExpiresAt: new Date(new Date().getTime() + 3 * 60 * 60 * 1000) // 3 hours
        });

        try {

            yield mail.sendMail( confirmRegistrationLetter(params.email, token) );

        } catch(err) {
            this.throw(500, "Sending mail failed");
        }
        
        this.flash('success', 'Confirmation letter has been sent successfully! Please check your inbox!');
        this.redirect('/auth/reconfirm');

    } else {

        if(user.isConfirmed) {

            this.status = 400;
            this.flash('error', 'User with such email or login already exists! Please log into the system using your credentials!');
            this.redirect('/auth/login');

        } else {

            this.flash('error', 'Email is not confirmed! Please confirm your email!');
            this.redirect('/auth/reconfirm');

        }
    }
};


module.exports.confirm = function* (next) {
    const token = this.params.token || '';
    
    const user = yield User.findOne({ confirmEmailToken: token, isConfirmed: false });

    if(user) {

        if(user.confirmEmailTokenExpiresAt > new Date()) {

            user.isConfirmed = true;
            user.confirmEmailToken = null;
            user.confirmEmailTokenExpiresAt = null;

            yield user.save();

            this.flash.success = 'You have successfully confirmed your email! Please log into the system using your credentials!';
            this.redirect('/auth/login');

        } else {

            this.flash('error', 'Confirmation link is expired! Please send a new email confirmation request!');
            this.redirect('/auth/reconfirm');

        }

    } else {

        this.flash('error', 'No active registration process found or email is already confirmed!');
        this.redirect('/auth/login');

    }
};

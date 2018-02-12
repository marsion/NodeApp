const config = require('config');
const nodemailer = require('nodemailer');

const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'app.send.mail.service@gmail.com',
        pass: 'qwerty123pass'
    }
};

exports.mail = nodemailer.createTransport(smtpConfig);

exports.confirmRegistrationLetter = (email, token) => {
    return {
        from: `${ config.siteName } <node@app.com>`,
        to: email,
        subject: `Confirm registration on ${ config.siteName }`,
        text: `To complete registration of your new account on ${ config.siteName } please click the link below`,
        html: `To complete registration of your new account on ${ config.siteName } please click the link below:<br/><br/><b> 
                <a href="${config.siteHost}/auth/registration/${token}">${ config.siteHost }/auth/registration/${ token }</a></b>`
    };
};

exports.forgotPasswordLetter = (email, token) => {
    return {
        from: `${ config.siteName } <node@app.com>`,
        to: email,
        subject: `Change password on ${ config.siteName }`,
        text: `To change password of your account on ${ config.siteName } please click the link below`,
        html: `To change password of your account on ${ config.siteName } please click the link below:<br/><br/><b> 
                <a href="${config.siteHost}/auth/set-password/${token}">${ config.siteHost }/auth/set-password/${ token }</a></b>`
    };
};
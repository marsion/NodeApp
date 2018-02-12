const config = require('config')
	, path = require('path')
    , pug = require('pug');

const defaultLocals = config.jade;

exports.init = app => {
    
    app.use(function* (next) {

        this.render = (template, options) => {

            const locals = Object.assign({}, defaultLocals, options);

            Object.defineProperty(locals, 'user', {
                get: () => {
                    return this.req.user;
                }
            });

            Object.defineProperty(locals, 'authorized', {
                get: () => {
                    return !!this.req.user;
                }
            });

            Object.defineProperty(locals, 'flashMessages', {
                get: () => {
                    return this.flashMessages;
                }
            });

            const templatePath = path.join(config.root, 'handlers', `${template}.pug`);
            
            return pug.renderFile(templatePath, locals);

        };

        yield* next;
    })
};
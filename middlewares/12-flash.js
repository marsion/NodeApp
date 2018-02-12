exports.init = app => {

    app.use(function* (next) {

        this.flashMessages = this.session.flashMessages || {};

        delete this.session.flashMessages;

        yield* next;

        if(!this.session) return;

        if(this.status == 302 && !this.session.flashMessages) {
            this.session.flashMessages = this.flashMessages;
        }
    });

    app.context.flash = function(type, html) {

        if(!this.session.flashMessages) {
            this.session.flashMessages = {};
        }

        if(!this.session.flashMessages[type]) {
            this.session.flashMessages[type] = [];
        }

        this.session.flashMessages[type].push(html);
    };
};
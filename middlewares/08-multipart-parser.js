const busboy = require('co-busboy');

exports.init = app => {
    
    app.use(function* (next) {
        if (!this.request.is('multipart/*')) return yield* next;

        const parser = busboy(this, {
            autoFields: true
        });

        let part;
        while (part = yield parser) {
            this.throw(400, 'Files are not allowed here');
        }

        for (let key in parser.fields) {
            this.request.body[key] = parser.fields[key];
        }

        yield* next;
    })
};
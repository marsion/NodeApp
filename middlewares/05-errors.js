exports.init = app => {
    app.use(function* (next) {
        try {

            yield* next;

        } catch(e) {

            this.set('X-Content-Type-Options', 'nosniff');

            let preferredType = this.accepts('html', 'json');

            if(e.status) {

                this.status = e.status;

                if (preferredType == 'json') {
                    this.body = {
                        error: e.message
                    };
                } else {
                    this.body = this.render('errorHandler/templates/error', {
                        error: {
                            statusCode: e.status,
                            message: e.message
                        }
                    });
                }

            } else if (e.name == 'ValidationError') {

                this.status = 400;

                const errors = {};

                for(const field in e.errors) {
                    errors[field] = e.errors[field].message;
                }

                if (preferredType == 'json') {
                    this.body = {
                        errors: errors
                    };
                } else {

                    let errorText = '';
                    for(const field in errors) {
                        errorText += errors[field] + ' '
                    }

                    this.status = 400;
                    this.body = this.render('errorHandler/templates/error', {
                        error: {
                            statusCode: 400,
                            message: 'Invalid input data: ' + errorText
                        }
                    });
                }

            } else {
                console.log(e);
                this.status = 500;
                this.body = this.render('errorHandler/templates/error', {
                    error: {
                        statusCode: 500,
                        message: 'Internal Server Error'
                    }
                });
            }

        }
    })
};

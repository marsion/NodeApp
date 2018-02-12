const config = require('config');
const app = require('./app');
const socket = require('./modules/socket');

const port = config.port;

const server = app.listen(port, () => {
    console.log(`********* Server is listening on port: ${port}`);
});

socket(server);
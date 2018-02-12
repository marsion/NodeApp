const { expect } = require('chai');
const config = require('config');
const request = require('co-request');

const app = require('app');
const port = config.port;

describe('basic server tests', () => {

    let server;

    before('start server', function* () {
        yield new Promise(resolve => {
            server = app.listen(port, resolve);
        });
    });

    after('stop server', function* () {
        yield new Promise(resolve => {
            server.close(resolve);
        })
    });

    describe('GET /', () => {

        it('should open a page', function* () {
            const response = yield request.get(`http://localhost:${port}`);
        });

        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
    })
});
'use strict';

const path = require('path');
const defer = require('config/defer').deferConfig;

module.exports = {
    port: process.env.PORT,
    siteName: 'NodeApp',
    siteHost: 'http://localhost:3000',
    secret: process.env.SECRET,
    root: process.cwd(),
    mongoose: {
        uri: "mongodb://localhost/test",
        options: {
            server: {
                poolSize: 5,
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    },
    public: {
        root: defer(cfg => {
            return path.join(cfg.root, 'public');
        })
    },
    jade: {
        basedir: defer(cfg => {
            return path.join(cfg.root, 'templates');
        }),
        cache: true,
        pretty: true
    },
    middlewares: {
        root: defer(cfg => {
            return path.join(cfg.root, 'middlewares');
        })
    },
    crypto: {
        hash: {
            length: 128,
            iterations: 12000
        }
    },
    auth: {
        providers: {
            vk: {
                appId: '5574724',
                appSecret: 'by9DjO4zDEOTOTWIMNnB'
            },
            facebook: {
                appId: '1',
                appSecret: '1'
            },
            github: {
                appId: 'ad77c8634a338a1adda4',
                appSecret: '726d3369085042c4c378fb95c7ce2bcac44b25d3'
            },
            twitter: {
                appId: 'telt0fLPfWxgKe8LHg5g2JnQY',
                appSecret: 'tz6TbxLGRInJsgFPIeSGgbI68t72Fd8GoZrHQIWiOlrl6pCCj0'
            }
        }
    }
};

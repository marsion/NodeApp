const config = require('config');
const mongoose = require('mongoose');
const co = require('co');
const Cookies = require('cookies');
const { Post } = require('posts');
const { User } = require('users');

const socketIO = require('socket.io');
const socketEmitter = require('socket.io-emitter');
const redisClient = require('redis').createClient({ host: 'localhost', port: 6379 });
const socketRedis = require('socket.io-redis');

const sessionStore = require('db/sessionStore');

function socket(server) {
    const io = socketIO(server);

    io.adapter(socketRedis(redisClient));

    io.use((socket, next) => {

        const handshakeData = socket.request;

        const cookies = new Cookies(handshakeData, {}, config.keys);

        const sid = `koa:sess:${ cookies.get('koa.sid') }`;

        co(function* () {
            const session = yield* sessionStore.get(sid, true);

            if(!session) {
                throw new Error('No session');
            }

            if(!session.passport && !session.passport.user) {
                throw new Error('Anonymous sessions not allowed');
            }

            socket.user = yield User.findById(session.passport.user);

            socket.session = session; 
            //зачем в сокет записывать сессию? 
            // тем более, если мы ее еще потом изменяем?

            session.socketIDs = session.socketIDs ?
                session.socketIDs.concat(socket.id) : [ socket.id ];

            yield* sessionStore.save(sid, session);

            socket.on('disconnect', function() {
                console.log('user disconnected');

                co(function* () {
                    const session = yield* sessionStore.get(sid, true);
                    if(session) {
                        session.socketIDs.splice(session.socketIDs.indexOf(socket.id), 1);
                        yield* sessionStore.save(sid, session);
                    }
                }).catch(err => { console.log(err) });

                socket.broadcast.emit('presence notification', {
                    text: `${ socket.user.displayName } left the chat`,
                    createdAt: new Date()
                });
            });

        }).then(
            () => next(),
            (err) => next(err)
        );

    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.emit('user', socket.user);

        co(function* () {
            const posts = yield Post.find({}).populate('author');

            socket.emit('load history', posts);
            
        }).catch(
            err => { console.log(err) }
        );
        
        socket.broadcast.emit('presence notification', {
            text: `${ socket.user.displayName } joined the chat`,
            createdAt: new Date()
        });

        socket.on('new own post', function(data, callback) {
            co(function* () {
                const post = yield Post.create({
                    author: socket.user._id,
                    text: data.text,
                    createdAt: data.createdAt
                });

                return yield Post.findById(post._id).populate('author');

            }).then(
                post => {
                    socket.broadcast.emit('new foreign post', post);
                    callback(null, post._id);
                },
                err => {
                    callback(err);
                }
            );

        });

        socket.on('user is typing', function(data) {
            socket.broadcast.emit('user is typing', socket.user.displayName);
        });

        socket.on('delete post', id => {

            co(function* () {

                yield Post.remove({ _id: id, author: socket.user._id });

            }).then(
                () => {
                    socket.broadcast.emit('post was deleted', {
                        id: id,
                        username: socket.user.displayName,
                        date: Date.now()
                    });
                },
                err => { console.log(err) }
            );
        });

        socket.on('edit post', (data, callback) => {

            co(function* () {

                yield Post.update({ _id: data.id, author: socket.user._id }, {$set: {text : data.text}});

            }).then(
                () => {
                    socket.broadcast.emit('post was edited', { id: data.id, text: data.text });
                    callback(null, data.id);
                },
                err => callback(err)
            );
        });

        // а где обрабатывать ошибки? что здесь с ней делать? куда вывести или кому передать?
    });
}

socket.emitter = socketEmitter(redisClient);

module.exports = socket;
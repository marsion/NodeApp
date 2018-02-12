'use strict';

const socket = io();

socket.on('user', (user) => {
    socket.user = user;
});

socket.on('load history', posts => {
    posts.forEach(post => {
        if(post.author._id == socket.user._id) {
            chat.showOwnPost(post);
        } else {
            chat.showForeignPost(post);
        }
    });
});

socket.on('new foreign post', function(post) {
    chat.showForeignPost(post);
});

socket.on('post was deleted', data => {
    chat.removePost(data);
});

socket.on('post was edited', data => {
    chat.editPost(data);
});

socket.on('presence notification', msg => {
    chat.showPresenceNotification(msg);
});

socket.on('user is typing', displayName => {
    chat.showTypingNotification(displayName);
});

socket.on('logout', () => {
    socket.disconnect();
    window.location.reload();
});

chat.getRootElem().addEventListener('typing', function(event) {
    socket.emit('user is typing');
});

const clientIds = [];
chat.getRootElem().addEventListener('send', function(event) {
    
    const clientId = Math.random();
    clientIds.push(clientId);
    
    const post = {
        clientId: clientId,
        author: { displayName: socket.user.displayName },
        text: event.detail.text,
        createdAt: new Date()
    };
    
    chat.showOwnPost(post);

    socket.emit('new own post', post, (error, id) => {
        if(!error) {
            chat.displayDeliveryStatus(true, clientId, id);
        } else {
            chat.displayDeliveryStatus(false, clientId, null, error);
        }
        clientIds.splice(clientIds.indexOf(clientId), 1);
    });
});

chat.getRootElem().addEventListener('delete', function(event) {
    chat.removePost({
        id: event.detail.id,
        username: 'you',
        date: Date.now()
    });
    socket.emit('delete post', event.detail.id);
});

chat.getRootElem().addEventListener('edit', function(event) {
    const post = {
        id: event.detail.id,
        text: event.detail.text
    };
    chat.editPost(post);
    socket.emit('edit post', post, (error, id) => {
        chat.displayEditingStatus(error, id);
    });
});
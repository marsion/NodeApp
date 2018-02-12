'use strict';

function Chat(options) {
    const elem = options.elem;
    let postTemplate;

    this.getRootElem = () => {
        return elem;
    };
    
    this.render = function() {
        const chatTemplate = _.template(document.getElementById('chat-template').innerHTML);
        postTemplate = _.template(document.getElementById('post-template').innerHTML);
        elem.innerHTML = chatTemplate();
    };

    this.showPresenceNotification = message => {
        const presenceBox = elem.querySelector('.chat__presence');
        presenceBox.innerHTML = message.text + ' at ' + formatTime(message.createdAt);
        setTimeout(() => {
            presenceBox.innerHTML = '';
        }, 5000);
    };

    this.showTypingNotification = displayName => {
        const typingBox = elem.querySelector('.chat__typing');
        typingBox.innerHTML = `${ displayName } is typing`;
        setTimeout(() => {
            typingBox.innerHTML = '';
        }, 5000);
    };
    
    function scrollToBottom() {
        elem.querySelector('.chat__posts-box').scrollTop = elem.querySelector('.chat__posts-bottom').offsetTop;
    }
    
    function showPost(template, post) {
        post.createdAt = formatTime(post.createdAt);
        const li = document.createElement('li');
        li.innerHTML = template(post);
        elem.querySelector('ul').appendChild(li);
        scrollToBottom();
    }
    
    this.showOwnPost = post => {
        showPost(postTemplate, Object.assign({}, { ownership: 'own' }, post));
    };
    
    this.showForeignPost = post => {
        showPost(postTemplate, Object.assign({}, { ownership: 'foreign' }, post));
    };

    this.displayDeliveryStatus = (status, clientId, serverId, e) => {
        const post = elem.querySelector('div[data-client-id="' + clientId + '"]');
        if(!post) return;

        const deliveredStatuses = elem.querySelectorAll('.chat__post-delivering .chat__post-delivery-success');

        for (var i = 0; i < deliveredStatuses.length; i++) {
            deliveredStatuses[i].innerHTML = '';
        }

        if(status) {
            post.setAttribute('data-id', serverId);
            post.removeAttribute('data-client-id');
            post.querySelector('.chat__post-delivering').innerHTML 
                = '<span class="chat__post-delivery-success text-success">Delivered</span>';
        } else {
            let errorText = '';

            if (e.name == 'ValidationError') {
                const errors = {};

                for(let field in e.errors) {
                    errors[field] = e.errors[field].message;
                }

                for(let field in errors) {
                    errorText += errors[field] + '<br> '
                }

            } else {
                errorText = e.name + ': ' + e.message;
            }

            post.querySelector('.chat__post-delivering').innerHTML =
                `<span class="chat__post-delivery-fail text-danger">Not delivered<p>${ errorText }</p></span>`;
        }
        scrollToBottom();
    };

    this.displayEditingStatus = (e, id) => {
        const post = elem.querySelector('div[data-id="' + id + '"]');
        if(!post) return;

        const deliveredStatuses = elem.querySelectorAll('.chat__post-delivering .chat__post-delivery-success');

        for (var i = 0; i < deliveredStatuses.length; i++) {
            deliveredStatuses[i].innerHTML = '';
        }

        if(!e) {
            post.querySelector('.chat__post-delivering').innerHTML
                = '<span class="chat__post-delivery-success text-success">Updated</span>';
        } else {
            let errorText = '';

            if (e.name == 'ValidationError') {
                const errors = {};

                for(let field in e.errors) {
                    errors[field] = e.errors[field].message;
                }

                for(let field in errors) {
                    errorText += errors[field] + '<br> '
                }

            } else {
                errorText = e.name + ': ' + e.message;
            }

            post.querySelector('.chat__post-delivering').innerHTML =
                `<span class="chat__post-delivery-fail text-danger">Not updated<p>${ errorText }</p></span>`;
        }
    };
    
    this.removePost = data => {
        const post = elem.querySelector('div[data-id="' + data.id + '"]');
        if (!post) return;
        
        data.date = new Date(data.date);
        post.parentElement.innerHTML 
            = `<div class="chat__post-removed">Removed by ${ data.username } at ${ formatTime(data.date) }</div>`;
    };

    this.editPost = data => {
        const post = elem.querySelector('div[data-id="' + data.id + '"]');
        if (!post) return;
        post.querySelector('.chat__post-body').innerHTML = data.text;
    };
    
    elem.addEventListener('keydown', event => {
        if (!event.target.classList.contains('chat__send-input')) return;
        elem.dispatchEvent(new KeyboardEvent('typing'));
    });

    elem.addEventListener('submit', event => {
        if (event.target.classList.contains('chat__send')) sendPost(event);
        event.preventDefault();
    });

    elem.addEventListener('click', event => {

        if (event.target.classList.contains('chat__delete-icon')) notifyAboutDeleting(event);
        if (event.target.classList.contains('chat__edit-icon')) prepareEditing(event);
        if (event.target.classList.contains('chat__send-cancel')) cancelEditing();

    });

    function sendPost(event) {
        let e;
        const inputElem = elem.querySelector('.chat__send-input');
        const text = inputElem.value;
        if(!text) return;

        const id = elem.querySelector('.chat__send-input-id').value;
        if(!id) {
            e = new CustomEvent("send", {
                detail: { text: text }
            });
        } else {
            e = new CustomEvent("edit", {
                detail: { id: id, text: text }
            });
        }
        
        elem.dispatchEvent(e);

        inputElem.value = '';

        cancelEditing();
    }
    
    function notifyAboutDeleting(event) {
        const post = event.target.closest('.chat__post');
        const id = post.getAttribute('data-id');
        if(!id) return;

        const deleteEvent = new CustomEvent("delete", {
            detail: { id: id }
        });
        elem.dispatchEvent(deleteEvent);
    }

    function prepareEditing(event) {
        const post = event.target.closest('.chat__post');
        const id = post.getAttribute('data-id');
        if(!id) return;
        const text = post.querySelector('.chat__post-body').innerHTML;

        elem.querySelector('.chat__send-input-id').value = id;
        elem.querySelector('.chat__send-input').value = text;
        elem.querySelector('.chat__send-cancel').style.display = 'inline-block';
    }

    function cancelEditing() {
        elem.querySelector('.chat__send-input-id').value = '';
        elem.querySelector('.chat__send-input').value = '';
        elem.querySelector('.chat__send-cancel').style.display = 'none';
    }

    function formatTime(createdAt) {
        if(typeof createdAt == 'string') createdAt = new Date(createdAt);

        createdAt = [
            '0' + createdAt.getHours(),
            '0' + createdAt.getMinutes(),
            '0' + createdAt.getSeconds()
        ];

        for (var i = 0; i < createdAt.length; i++) {
            createdAt[i] = createdAt[i].slice(-2);
        }

        return createdAt.join(':');
    }
}

const chat = new Chat({
    elem: document.getElementById('generalTab')
});

chat.render();

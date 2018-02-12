module.exports.get = function* () {
    
    this.body = this.render('chat/templates/chat', { user: this.user });
    
};
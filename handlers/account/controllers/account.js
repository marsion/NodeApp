const { User } = require('users');
const { Post } = require('posts');
const dateFormat = require('dateformat');

exports.verify = function* (login, next) {
    if(login) {
        this.verifiedUser = yield User.findOne({ login: login });
        if(!this.verifiedUser) {
            this.throw('No such user', 404);
        }
        yield* next;
    } else {
        this.throw('Login is required', 400);
    }
};

exports.getAll = function* (next) {
    
    const users = yield User.find({});

    const usersPublic = users.map(user => user.getPublicFields());

    this.body = this.render('account/templates/all', { users: usersPublic });
    
};

exports.getOne = function* (next) {
    
    this.body = this.render('account/templates/one', { profile: this.verifiedUser });
    
};

exports.getPosts = function* (next) {

    let posts = yield Post.find({ author: this.verifiedUser._id }).lean();
    posts.forEach(post => {
        post.createdAt = dateFormat(new Date(post.createdAt), "dd/mm/yyyy ' at ' HH:MM:ss");
    });
    this.body = this.render('account/templates/posts', { profile: this.verifiedUser, posts: posts });

};
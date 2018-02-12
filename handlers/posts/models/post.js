const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'Author is required!'
    },
    text: {
        type: String,
        required: 'Text is required!',
        trim: true,
        validate: [
            {
                validator: value => {
                    return /^.{3,300}$/.test(value);
                },
                msg: 'Post must be 3-300 characters in length!'
            }
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);

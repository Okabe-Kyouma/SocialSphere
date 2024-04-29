const mongoose = require('mongoose');

const postModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    imageLink: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            username: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model('Post', postModel);

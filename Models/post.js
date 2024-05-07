const mongoose = require('mongoose');

const postModel = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:'user',
    },
    authorUsername : String,
    postDescription : String,
    image: String,
    likes: [{
        personLiked: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'user',
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [
        {
            personCommented : {
            type : mongoose.Schema.ObjectId,
            ref: 'comment'
            },
            comment : String,
            username : String,
            uuid : String,
        },
    ],
});

module.exports = mongoose.model('Post', postModel);

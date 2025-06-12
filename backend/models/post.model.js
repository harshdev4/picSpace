const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image:{ 
        type: String,
        required: true
    },
    caption:{
        type: String,
        required: true
    }, 
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
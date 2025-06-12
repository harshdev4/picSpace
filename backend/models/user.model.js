const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    fullname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,
    },
    profileBio:{
        type:String,
    },
    post:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    likedPost:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }    
});

module.exports = mongoose.model('User', userSchema);
const compressImage = require('../utils/compressImage.utils');
const {uploadToCloudinary} = require('../utils/uploadToCloudinary.utils');
const deleteFromCloudinary = require('../utils/deleteFromCloudinary.utils');
const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const mongoose = require('mongoose');
  
exports.create = async (req, res) => {
    const caption = req.body.caption;
    try {
        const optimizedImage = await compressImage(req.file.buffer);
        const result = await uploadToCloudinary(optimizedImage);

        const user = await userModel.findById(req.user.id);
        const post = await postModel.create({
            image: result.secure_url,
            caption: caption.trim(),
            user: user._id
        });
        user.post.push(post._id);
        await user.save();
        res.status(201).json({ message: "post created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server error, try again" });
    }
}

exports.singlePost = async (req, res) => {
    try {
        const { postId } = req.query;
        const post = await postModel.findById(postId).populate("user", "profilePic fullname username");
        if (!post) {
            return res.status(404).json({error: "Not the valid url"});
        }
        res.status(200).json({message: "Post found", post});
    } catch (error) {
        return res.status(500).json({error: "Something went wrong"});
    }
}

exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalPosts = await postModel.countDocuments();
        const posts = await postModel.find().sort({createdAt: -1}).limit(10).skip(skip).populate("user", "profilePic fullname username");
        
        const hasMore = skip + posts.length < totalPosts;
        res.status(200).json({ message: "post fetched successfully", posts, hasMore });
    } catch (error) {
        res.status(500).json({ error: "Internal error occurs" });
    }
}

exports.updateCaption = async (req, res) => {
    try {
        const {postId, userId} = req.query;
        const { caption } = req.body;
        const post = await postModel.findById(postId);
        if (!post.user.equals(userId)) {
            return res.status(400).json({error: 'Not authorized'});
        }
        post.caption = caption;
        await post.save();
        res.status(200).json({message: 'Caption saved successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Something went wrong'});
    }
}

exports.like = async (req, res) => {
    const postId = req.query.postId;
    try {
        const userId = req.user.id;

        const post = await postModel.findById(postId);

        const user = await userModel.findById(userId); 
        const hasLiked = user.likedPost.includes(postId);

        if (hasLiked) {
            post.likes = post.likes.filter(id => !id.equals(user._id));
            
            user.likedPost = user.likedPost.filter(id => !id.equals(post._id));
            
            await post.save();
            await user.save();
            return res.status(200).json({message: 'Like removed'});
        }

        post.likes.push(user._id);

        await post.save();

        user.likedPost.push(post._id);
        await user.save();

        res.status(200).json({message: 'Post Liked'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong'});
    }
}

exports.deletePost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await postModel.findByIdAndDelete(id).populate("likes");
        
        const user = await userModel.findById(req.user.id);
        
        user.post = user.post.filter(id => !id.equals(post._id));
        await user.save();

        post.likes.forEach(async (userId) => {
            const user = await userModel.findById(userId)
            user.likedPost = user.likedPost.filter(id => !id.equals(post._id));
            await user.save();
        })
        
        const imageUrl = post.image;
        const publicId = (imageUrl.split('/')).slice(-2,).join('/').slice(0, -4);
        await deleteFromCloudinary(publicId);
       
        res.status(200).json({message: 'Post Deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal error occurs" });
    }
}
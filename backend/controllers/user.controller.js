const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const validateUser = require("../utils/validateUser.utils");
const bcrypt = require('bcrypt');
const compressImage = require("../utils/compressImage.utils");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary.utils");
const deleteFromCloudinary = require('../utils/deleteFromCloudinary.utils');

const SALT_ROUND = parseInt(process.env.SALT_ROUND);
const SECRET_KEY = process.env.SECRET_KEY;

exports.register = async (req, res) => {
    let { email, username, fullname, password } = req.body;
    email = email.trim()
    username = username.trim()
    fullname = fullname.trim().slice(0, 1).toUpperCase() + fullname.trim().slice(1,)
    password = password.trim()

    if (!email || !username || !fullname || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        validateUser(email, password, fullname);

        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser)
            return res.status(409).json({ error: "User already exists" });

        const encryptPassword = await bcrypt.hash(password, SALT_ROUND);

        const newUser = await userModel.create({ email, username, fullname, password: encryptPassword });
        const userData = {
            id: newUser._id,
            username: newUser.username,
            fullname: newUser.fullname,
            profilePic: newUser.profilePic,
            bio: newUser.profileBio,
            following: newUser.following
        }
        const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '7d' });
        res.cookie('access_token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        return res.status(200).json({ message: 'User signed in success', user: userData });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    let { username, password } = req.body;
    username = username.trim()
    password = password.trim()

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
            if (isPasswordMatch) {
                const userData = {
                    id: existingUser._id,
                    username: existingUser.username,
                    fullname: existingUser.fullname,
                    profilePic: existingUser.profilePic,
                    bio: existingUser.profileBio,
                    following: existingUser.following
                }
                const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, { expiresIn: '7d' });
                res.cookie('access_token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
                return res.status(200).json({ message: 'User logged in success', user: userData });
            } else {
                res.status(400).json({ error: "Invalid username or password" })
            }
        }
        else {
            res.status(400).json({ error: "Invalid username or password" });
        }

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
}

exports.isLoggedIn = async (req, res) => {
    const user = req.user;
    return res.status(200).json({ user });
}

exports.getUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find().select('username fullname profilePic').sort({ createdAt: -1 });

        let loggedInUser;
        const otherUsers = [];

        for (const user of allUsers) {
            if (user._id.equals(req.user.id)) {
                loggedInUser = user;
            } else {
                otherUsers.push(user);
            }
        }

        const users = loggedInUser ? [loggedInUser, ...otherUsers] : otherUsers;

        res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

exports.getFollowing = async (req, res) => {
    try {
        const profileUser = req.params.username
        const allUsers = await userModel.findOne({ username: profileUser }).select('following').populate("following", "profilePic username fullname")
        res.status(200).json({ message: 'Users fetched successfully', users: allUsers.following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

exports.getFollowers = async (req, res) => {
    try {
        const profileUser = req.params.username
        const allUsers = await userModel.findOne({ username: profileUser }).select('followers').populate("followers", "profilePic username fullname")

        res.status(200).json({ message: 'Users fetched successfully', users: allUsers.followers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

exports.searchUser = async (req, res) => {
    const query = req.query.searchQuery;
    try {
        const regex = new RegExp(query, 'i');
        const users = await userModel.find({ fullname: regex }).select("profilePic username fullname");
        if (users.length === 0) {
            return res.status(200).json({ message: "No user found", users });
        }
        res.status(200).json({ message: "Search successful", users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

exports.saveProfileImage = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        const imageUrl = user.profilePic;

        const optimizedImage = await compressImage(req.file.buffer);
        const result = await uploadToCloudinary(optimizedImage);

        user.profilePic = result.secure_url;
        await user.save();
        if (imageUrl) {
            const publicId = (imageUrl.split('/')).slice(-2,).join('/').slice(0, -4);
            await deleteFromCloudinary(publicId);
        }

        res.status(200).json({ message: 'Image saved successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal error occurs" });
    }
}

exports.saveProfileData = async (req, res) => {
    const { fullname, bio } = req.body;
    if (!fullname.trim()) {
        return res.status(400).json({ error: "Name cannot be empty" });
    }
    try {
        const user = await userModel.findById(req.user.id);
        user.fullname = fullname.trim();
        user.profileBio = bio.trim();
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal error occurs" });
    }
}

exports.getProfile = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await userModel.findOne({ username }).populate("post likedPost");
        if (!user) {
            return res.status(404).json({ error: "No user found" });
        }
        res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal error occurs" });
    }
}

exports.follow = async (req, res) => {
    try {
        const username = req.params.username;
        const user_being_followed = await userModel.findOne({ username });
        if (user_being_followed) {
            const user = await userModel.findById(req.user.id);

            if (!user_being_followed.followers.includes(req.user.id)) {
                user_being_followed.followers.push(req.user.id);
                user.following.push(user_being_followed._id);
            }
            else {
                user_being_followed.followers = user_being_followed.followers.filter(userId => !userId.equals(user._id));
                user.following = user.following.filter(userId => !userId.equals(user_being_followed._id));
            }
            await user_being_followed.save();
            await user.save();
            return res.status(200).json({ message: "Follow Action Successfull" });
        }
        res.status(404).json({ error: "User not found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

exports.logout = (req, res) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json({ message: 'Logout SuccessFully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to logout, Try again after sometime" });
    }
};
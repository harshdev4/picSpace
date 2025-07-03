const express = require('express');
const { register, login, isLoggedIn, getUsers, searchUser, saveProfileImage, saveProfileData, getProfile, logout, follow, getFollowing, getFollowers } = require('../controllers/user.controller');
const protectedRoute = require('../middleware/auth.middleware');
const upload = require('../config/multer.config');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/isLoggedIn', protectedRoute, isLoggedIn);
router.get('/getUsers', protectedRoute, getUsers);
router.get('/:username/following', protectedRoute, getFollowing);
router.get('/:username/followers', protectedRoute, getFollowers);
router.get('/searchUser', protectedRoute, searchUser);
router.patch('/saveProfileImage', protectedRoute, upload.single('profilePic'), saveProfileImage);
router.patch('/saveProfileData', protectedRoute, saveProfileData);
router.get('/getProfile/:username', protectedRoute, getProfile);
router.get('/logout', protectedRoute, logout);
router.patch('/follow/:username', protectedRoute, follow);

module.exports = router;
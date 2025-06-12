const express = require('express');
const protectedRoute = require('../middleware/auth.middleware');
const { create, getPosts, like, deletePost, updateCaption, singlePost } = require('../controllers/post.controller');
const upload = require('../config/multer.config');

const router = express.Router();

router.post('/create', protectedRoute, upload.single('image'), create);
router.get('/singlePost', singlePost);
router.get('/getPosts', protectedRoute, getPosts);
router.patch('/updateCaption', protectedRoute, updateCaption); 
router.patch('/like', protectedRoute, like);
router.delete('/deletePost/:id', protectedRoute, deletePost);

module.exports = router;
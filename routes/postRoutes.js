// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, addCommentToPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// /api/posts
router.route('/').get(getPosts).post(protect, createPost);

// /api/posts/:id/like
router.route('/:id/like').put(protect, likePost);

// /api/posts/:id/comments
router.route('/:id/comments').post(protect, addCommentToPost); // NOUVELLE ROUTE

module.exports = router;
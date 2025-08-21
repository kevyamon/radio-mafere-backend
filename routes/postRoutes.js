// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// On utilise router.route() pour chainer les requêtes sur la même URL de base

// /api/posts
router.route('/').get(getPosts).post(protect, createPost);

// /api/posts/:id/like
router.route('/:id/like').put(protect, likePost); // NOUVELLE ROUTE

module.exports = router;
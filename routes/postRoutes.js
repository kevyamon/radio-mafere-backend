// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Route pour récupérer tous les posts (publique)
router.get('/', getPosts);

// Route pour créer un post (protégée)
// Le middleware `protect` s'exécutera avant `createPost`
router.post('/', protect, createPost);

module.exports = router;
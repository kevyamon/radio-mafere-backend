// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Créer un nouveau post
// @route   POST /api/posts
// @access  Privé
const createPost = async (req, res) => {
  const { content, type } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Le contenu ne peut pas être vide.' });
  }

  try {
    const post = new Post({
      content,
      type,
      author: req.user._id, // L'ID de l'auteur est fourni par le middleware `protect`
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// @desc    Récupérer tous les posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    // On récupère les posts et on "popule" l'auteur avec son username et son prénom
    const posts = await Post.find({})
      .populate('author', 'username prenom')
      .sort({ createdAt: -1 }); // Tri par date de création, le plus récent en premier
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { createPost, getPosts };s
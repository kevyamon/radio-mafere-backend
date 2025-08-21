// controllers/postController.js
const Post = require('../models/Post');

// --- Créer un nouveau post (inchangé) ---
const createPost = async (req, res) => {
  const { content, type } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Le contenu ne peut pas être vide.' });
  }
  try {
    const post = new Post({ content, type, author: req.user._id });
    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// --- Récupérer tous les posts (inchangé) ---
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate('author', 'username prenom').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// --- NOUVELLE FONCTION : Liker/Unliker un post ---
// @desc    Liker ou unliker un post
// @route   PUT /api/posts/:id/like
// @access  Privé
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // On vérifie si l'utilisateur (req.user._id) a déjà liké le post
    // post.likes est un tableau d'IDs, on cherche si l'ID de l'utilisateur y est
    if (post.likes.includes(req.user._id)) {
      // Si oui, on retire son like (unlike)
      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== req.user._id.toString()
      );
    } else {
      // Si non, on ajoute son like
      post.likes.push(req.user._id);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { createPost, getPosts, likePost }; // On exporte la nouvelle fonction
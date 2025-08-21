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

// --- Récupérer tous les posts (mis à jour) ---
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'username prenom') // Popule l'auteur du post
      .populate('comments.author', 'username prenom') // Popule l'auteur de chaque commentaire
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// --- Liker/Unliker un post (inchangé) ---
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// --- NOUVELLE FONCTION : Ajouter un commentaire ---
// @desc    Commenter un post
// @route   POST /api/posts/:id/comments
// @access  Privé
const addCommentToPost = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Le commentaire ne peut pas être vide.' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    const newComment = {
      text: text,
      author: req.user._id,
    };

    post.comments.push(newComment);
    await post.save();

    // On re-popule le commentaire ajouté pour renvoyer le nom de l'auteur
    const populatedPost = await Post.findById(post._id).populate('comments.author', 'username prenom');
    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { createPost, getPosts, likePost, addCommentToPost };
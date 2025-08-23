// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User'); // <-- NOUVELLE LIGNE
const Notification = require('../models/Notification'); // <-- NOUVELLE LIGNE
const { getIo } = require('../socket');

// Fonction pour notifier les admins
const notifyAdmins = async (notificationData) => {
  const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } });
  admins.forEach(admin => {
    Notification.create({ ...notificationData, recipient: admin._id });
  });
  // On envoie un signal pour dire aux admins de rafraîchir leurs notifications
  getIo().to('admins').emit('new_notification');
};

// @desc    Créer un nouveau post
// @route   POST /api/posts
// @access  Privé
const createPost = async (req, res) => {
  const { content, type } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Le contenu ne peut pas être vide.' });
  }
  try {
    const post = new Post({ content, type, author: req.user._id });
    const createdPost = await post.save();
    
    const populatedPost = await Post.findById(createdPost._id).populate('author', 'username prenom');

    getIo().emit('new_post', populatedPost);

    // --- NOUVELLE PARTIE : CRÉATION DE LA NOTIFICATION ---
    if (type === 'dédicace') {
      notifyAdmins({
        message: `${populatedPost.author.prenom} a fait une nouvelle dédicace.`,
        type: 'nouvelle_dédicace',
        link: `/home#post-${createdPost._id}` // Lien direct vers le post
      });
    }
    // --- FIN DE LA NOUVELLE PARTIE ---

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// --- Les autres fonctions restent identiques ---

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'username prenom')
      .populate('comments.author', 'username prenom')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { return res.status(404).json({ message: 'Post non trouvé' }); }
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

const addCommentToPost = async (req, res) => {
  const { text } = req.body;
  if (!text) { return res.status(400).json({ message: 'Le commentaire ne peut pas être vide.' });}
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { return res.status(404).json({ message: 'Post non trouvé' }); }
    const newComment = { text: text, author: req.user._id };
    post.comments.push(newComment);
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('comments.author', 'username prenom');
    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];
    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

const updateUserStatus = async (req, res) => { /* ... (code from previous version) ... */ };
const getAllUsers = async (req, res) => { /* ... (code from previous version) ... */ };

module.exports = { createPost, getPosts, likePost, addCommentToPost };
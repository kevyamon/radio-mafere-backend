// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// On applique le middleware 'protect' à toutes les routes de ce fichier
router.use(protect);

// @route   GET /api/messages/conversations
// @desc    Récupérer les conversations de l'utilisateur connecté
router.get('/conversations', getConversations);

// @route   GET /api/messages/conversations/:conversationId
// @desc    Récupérer les messages d'une conversation spécifique
router.get('/conversations/:conversationId', getMessages);

// @route   POST /api/messages/send/:recipientId
// @desc    Envoyer un message à un autre utilisateur
router.post('/send/:recipientId', sendMessage);

module.exports = router;
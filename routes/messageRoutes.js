// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage, // <-- On importe
  updateMessage, // <-- On importe
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// --- Routes existantes ---
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId', getMessages);
router.post('/send/:recipientId', sendMessage);

// --- NOUVELLES ROUTES ---
// On utilise une route unique pour un message spécifique
router.route('/:messageId')
  .put(updateMessage)      // Pour modifier
  .delete(deleteMessage); // Pour supprimer

module.exports = router;
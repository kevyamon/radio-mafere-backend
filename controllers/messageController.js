// controllers/messageController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { getIo, emitToUser } = require('../socket');

// @desc    Obtenir toutes les conversations d'un utilisateur
// @route   GET /api/messages/conversations
// @access  Privé
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate({
        path: 'participants',
        select: 'prenom username photo', // On récupère les infos de l'autre participant
      })
      .sort({ updatedAt: -1 }); // Les plus récentes d'abord

    // On formate pour que le frontend reçoive directement les infos de l'autre utilisateur
    const formattedConversations = conversations.map(conv => {
        const otherParticipant = conv.participants.find(p => p._id.toString() !== userId.toString());
        return {
            _id: conv._id,
            otherParticipant: otherParticipant,
            lastMessage: conv.lastMessage,
            updatedAt: conv.updatedAt
        }
    });

    res.json(formattedConversations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// @desc    Obtenir les messages d'une conversation
// @route   GET /api/messages/conversations/:conversationId
// @access  Privé
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // On vérifie que l'utilisateur fait bien partie de la conversation
    const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conversation) {
        return res.status(403).json({ message: "Accès non autorisé à cette conversation." });
    }

    const messages = await Message.find({ conversationId }).populate('senderId', 'prenom');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// @desc    Envoyer un message
// @route   POST /api/messages/send/:recipientId
// @access  Privé
const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { recipientId } = req.params;
        const senderId = req.user._id;

        if (!text) return res.status(400).json({ message: "Le message ne peut être vide." });

        // On vérifie si une conversation existe déjà entre les deux utilisateurs
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        // Si non, on en crée une nouvelle
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recipientId],
            });
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            senderId,
            text,
        });

        await newMessage.save();

        // On met à jour la conversation avec le dernier message
        conversation.lastMessage = {
            text,
            sender: senderId,
            createdAt: newMessage.createdAt,
        };
        await conversation.save();

        // --- TEMPS RÉEL avec Socket.IO ---
        // On envoie le nouveau message directement au destinataire s'il est connecté
        emitToUser(recipientId, 'new_message', newMessage);

        res.status(201).json(newMessage);

    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur', error: error.message });
    }
};


module.exports = {
  getConversations,
  getMessages,
  sendMessage,
};
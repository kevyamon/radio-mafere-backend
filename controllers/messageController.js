// controllers/messageController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification'); // On s'assure que l'import est là
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
        select: 'prenom username photo',
      })
      .sort({ updatedAt: -1 });

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

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

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

        conversation.lastMessage = {
            text,
            sender: senderId,
            createdAt: newMessage.createdAt,
        };
        await conversation.save();
        
        const populatedMessage = await Message.findById(newMessage._id).populate('senderId', 'prenom');
        
        // --- LOGIQUE DE NOTIFICATION AJOUTÉE ICI ---
        await Notification.create({
            recipient: recipientId,
            message: `Vous avez un nouveau message de ${populatedMessage.senderId.prenom}.`,
            type: 'autre',
            link: `/messages`
        });
        // --- FIN DE LA LOGIQUE DE NOTIFICATION ---

        const recipient = conversation.participants.find(p => p.toString() !== senderId.toString());
        emitToUser(recipient.toString(), 'new_message', populatedMessage);
        emitToUser(recipient.toString(), 'new_notification'); // On dit à la cloche de se mettre à jour

        res.status(201).json(populatedMessage);

    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur', error: error.message });
    }
};

// --- NOUVELLES FONCTIONS ---

// @desc    Supprimer un message
// @route   DELETE /api/messages/:messageId
// @access  Privé
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message non trouvé." });
        }

        // On vérifie que l'utilisateur est bien l'auteur du message
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Action non autorisée." });
        }

        await message.deleteOne();

        // Optionnel : Mettre à jour le "lastMessage" de la conversation si c'était ce message
        // Pour la simplicité, nous allons laisser le frontend gérer le rafraîchissement complet

        res.json({ message: "Message supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur', error: error.message });
    }
};

// @desc    Modifier un message
// @route   PUT /api/messages/:messageId
// @access  Privé
const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        if (!text) return res.status(400).json({ message: "Le message ne peut être vide." });

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message non trouvé." });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Action non autorisée." });
        }

        message.text = text;
        await message.save();

        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur', error: error.message });
    }
};


module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
  updateMessage,
};
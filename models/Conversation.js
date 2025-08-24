// models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    // Un tableau contenant les IDs des deux utilisateurs dans la conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    // Une référence au dernier message envoyé pour un aperçu rapide
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: Date,
    },
  },
  { timestamps: true } // Ajoute createdAt et updatedAt
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
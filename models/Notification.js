// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // L'admin ou l'utilisateur qui reçoit la notif
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Le message de la notification
    message: {
      type: String,
      required: true,
    },
    // Le type de notification pour le filtrage
    type: {
      type: String,
      required: true,
      enum: ['nouvelle_dédicace', 'nouvelle_annonce', 'nouvel_utilisateur', 'autre'],
    },
    // Pour savoir si l'admin a vu la notif
    read: {
      type: Boolean,
      default: false,
    },
    // Un lien optionnel pour rediriger l'admin vers le contenu concerné
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
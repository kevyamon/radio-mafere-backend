// models/Announcement.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire.'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères.'],
    },
    content: {
      type: String,
      required: [true, 'Le contenu est obligatoire.'],
      trim: true,
      maxlength: [1000, 'Le contenu ne peut pas dépasser 1000 caractères.'],
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire.'],
      enum: ['emploi', 'vente', 'service', 'immobilier', 'autre'],
      default: 'autre',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['en_attente', 'approuvée', 'rejetée'],
      default: 'en_attente',
    },
    contactInfo: { // Champ optionnel pour que l'auteur puisse laisser un contact
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
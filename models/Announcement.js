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
    contactInfo: { 
      type: String,
      trim: true,
    },
    // NOUVEAU CHAMP POUR LES IMAGES
    images: [
      {
        url: { type: String, required: true }, // L'URL de l'image sur Cloudinary
        public_id: { type: String, required: true }, // L'ID public pour pouvoir la supprimer plus tard
      }
    ],
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
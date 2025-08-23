// models/Advertisement.js
const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String, // Sera une URL, probablement hébergée sur Cloudinary
      required: true,
    },
    imagePublicId: { // NOUVEAU CHAMP
      type: String,
      required: true,
    },
    targetUrl: {
      type: String, // Le site web vers lequel la pub redirige
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;
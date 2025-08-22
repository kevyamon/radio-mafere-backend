// models/LoginHistory.js
const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // La date de connexion est automatiquement ajoutée par timestamps
}, { timestamps: { createdAt: 'loginAt' } }); // On renomme createdAt en loginAt

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);
module.exports = LoginHistory;
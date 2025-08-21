// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true, trim: true },
  nom: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  telephone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  photo: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'super_admin'], 
    default: 'user' 
  },
  statut: { 
    type: String, 
    enum: ['actif', 'bloqué', 'banni'], 
    default: 'actif' 
  },
}, { timestamps: true });

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// NOUVELLE MÉTHODE : Pour comparer les mots de passe lors de la connexion
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
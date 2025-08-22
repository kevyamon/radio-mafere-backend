// controllers/authController.js
const User = require('../models/User');
const LoginHistory = require('../models/LoginHistory');
const generateToken = require('../utils/generateToken');
const { getIo } = require('../socket'); // On importe la capacité de parler en temps réel

// --- Fonction de Connexion (Mise à jour) ---
const loginUser = async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }, { telephone: login }],
    });

    if (user && (await user.matchPassword(password))) {
      if (user.statut === 'banni') {
        return res.status(403).json({ isBanned: true, message: 'Votre compte a été banni.' });
      }

      await LoginHistory.create({ user: user._id });

      // NOUVELLE ACTION : On envoie un signal pour rafraîchir les stats
      getIo().emit('stats_updated');

      res.json({
        _id: user._id,
        prenom: user.prenom,
        // ... autres infos ...
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Identifiants invalides.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};


// --- Code complet pour la lisibilité ---
const registerUser = async (req, res) => {
  const { prenom, nom, username, email, telephone, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }, { telephone }] });
    if (userExists) { return res.status(400).json({ message: 'Un utilisateur avec cet email, nom d\'utilisateur ou téléphone existe déjà.' }); }
    const user = await User.create({ prenom, nom, username, email, telephone, password });
    if (user) { res.status(201).json({ message: 'Utilisateur créé avec succès !' }); } 
    else { res.status(400).json({ message: 'Données utilisateur invalides.' }); }
  } catch (error) { res.status(500).json({ message: 'Erreur du serveur', error: error.message }); }
};

const loginUserComplete = async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email: login }, { username: login }, { telephone: login }] });
    if (user && (await user.matchPassword(password))) {
      if (user.statut === 'banni') { return res.status(403).json({ isBanned: true, message: 'Votre compte a été banni. Veuillez contacter un administrateur.' }); }
      await LoginHistory.create({ user: user._id });
      getIo().emit('stats_updated');
      res.json({ _id: user._id, prenom: user.prenom, nom: user.nom, username: user.username, email: user.email, role: user.role, token: generateToken(user._id) });
    } else { res.status(401).json({ message: 'Identifiants invalides.' }); }
  } catch (error) { res.status(500).json({ message: 'Erreur du serveur', error: error.message }); }
};

module.exports = { registerUser, loginUser: loginUserComplete };
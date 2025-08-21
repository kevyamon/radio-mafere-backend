// controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// --- Fonction d'inscription (inchangée) ---
const registerUser = async (req, res) => {
  const { prenom, nom, username, email, telephone, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }, { telephone }] });
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email, nom d\'utilisateur ou téléphone existe déjà.' });
    }
    const user = await User.create({ prenom, nom, username, email, telephone, password });
    if (user) {
      res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    } else {
      res.status(400).json({ message: 'Données utilisateur invalides.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// --- NOUVELLE FONCTION : Connexion ---
const loginUser = async (req, res) => {
  const { login, password } = req.body; // "login" peut être email, username, ou telephone

  try {
    // Chercher l'utilisateur par l'un des trois identifiants
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }, { telephone: login }],
    });

    // Si l'utilisateur existe ET que le mot de passe est correct
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // On lui donne son token
      });
    } else {
      res.status(401).json({ message: 'Identifiants invalides.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { registerUser, loginUser }; // On exporte la nouvelle fonction
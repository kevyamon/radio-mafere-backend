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

// --- Fonction de Connexion (Mise à jour) ---
const loginUser = async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }, { telephone: login }],
    });

    if (user && (await user.matchPassword(password))) {
      // NOUVELLE VÉRIFICATION : L'utilisateur est-il banni ?
      if (user.statut === 'banni') {
        return res.status(403).json({ // On utilise le statut 403 Forbidden
          isBanned: true,
          message: 'Votre compte a été banni. Veuillez contacter un administrateur.' 
        });
      }

      // Si tout est bon, on renvoie les infos de l'utilisateur avec le token
      res.json({
        _id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Identifiants invalides.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
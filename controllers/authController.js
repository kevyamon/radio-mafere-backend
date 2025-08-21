// controllers/authController.js
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { prenom, nom, username, email, telephone, password } = req.body;

  try {
    // Vérifier si l'email, username ou téléphone existe déjà
    const userExists = await User.findOne({ $or: [{ email }, { username }, { telephone }] });
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email, nom d\'utilisateur ou téléphone existe déjà.' });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      prenom,
      nom,
      username,
      email,
      telephone,
      password, // Le mot de passe sera haché par le middleware du modèle
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        message: 'Utilisateur créé avec succès !'
      });
    } else {
      res.status(400).json({ message: 'Données utilisateur invalides.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { registerUser };
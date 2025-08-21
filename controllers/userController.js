// controllers/userController.js
const User = require('../models/User');

// @desc    Récupérer tous les utilisateurs
// @route   GET /api/users
// @access  Privé/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // On récupère tous les users sans leur mot de passe
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { getAllUsers };
// controllers/userController.js
const User = require('../models/User');

// --- Récupérer tous les utilisateurs (inchangé) ---
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// --- NOUVELLE FONCTION : Mettre à jour le statut d'un utilisateur ---
// @desc    Modifier le statut d'un utilisateur (actif, banni, etc.)
// @route   PUT /api/users/:id/status
// @access  Privé/Admin
const updateUserStatus = async (req, res) => {
  const { statut } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Règle de sécurité : un admin ne peut pas modifier un super_admin
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Action non autorisée sur un super administrateur.' });
    }
    
    user.statut = statut || user.statut; // Met à jour le statut avec la nouvelle valeur
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      statut: updatedUser.statut,
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { getAllUsers, updateUserStatus };
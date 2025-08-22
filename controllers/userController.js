// controllers/userController.js
const User = require('../models/User');
const { emitToUser } = require('../socket'); // On importe notre fonction d'émission

// --- Récupérer tous les utilisateurs (inchangé) ---
const getAllUsers = async (req, res) => { /* ... */ };

// --- Mettre à jour le statut d'un utilisateur (Mise à jour) ---
const updateUserStatus = async (req, res) => {
  const { statut } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (user.role === 'super_admin') {
      return res.status(403).json({ message: 'Action non autorisée sur un super administrateur.' });
    }
    
    user.statut = statut || user.statut;
    const updatedUser = await user.save();

    // ON ÉMET L'ÉVÉNEMENT EN TEMPS RÉEL !
    emitToUser(user._id.toString(), 'status_updated', { statut: user.statut });

    res.json({ _id: updatedUser._id, statut: updatedUser.statut });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

// Code de getAllUsers pour la complétude
const getAllUsersFunc = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};
module.exports = { getAllUsers: getAllUsersFunc, updateUserStatus };
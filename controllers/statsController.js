// controllers/statsController.js
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Récupérer les statistiques générales
// @route   GET /api/stats
// @access  Privé/Admin
const getStats = async (req, res) => {
  try {
    // On lance toutes les requêtes à la base de données en même temps
    // C'est plus rapide et plus robuste
    const [totalUsers, totalPosts, usersByStatus] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: '$statut',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // On transforme le résultat de l'agrégation pour un accès plus facile
    const statusCounts = usersByStatus.reduce((acc, current) => {
      acc[current._id] = current.count;
      return acc;
    }, {});

    const stats = {
      totalUsers,
      totalPosts,
      usersByStatus: statusCounts,
    };

    res.json(stats);

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error); // Ajout d'un log pour le débogage
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { getStats };
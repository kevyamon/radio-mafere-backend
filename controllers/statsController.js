// controllers/statsController.js
const User = require('../models/User');
const Post = require('../models/Post');
const LoginHistory = require('../models/LoginHistory'); // On importe l'historique

// @desc    Récupérer les statistiques générales
// @route   GET /api/stats
// @access  Privé/Admin
const getStats = async (req, res) => {
  try {
    // --- Calcul des dates ---
    const now = new Date();
    const last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    // On lance toutes les requêtes en parallèle pour une performance maximale
    const [
      totalUsers,
      totalPosts,
      usersByStatus,
      activeUsers24h,
      activeUsers7d,
      activeUsers30d,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      User.aggregate([
        { $group: { _id: '$statut', count: { $sum: 1 } } },
      ]),
      // On compte les utilisateurs UNIQUES qui se sont connectés dans les dernières 24h
      LoginHistory.distinct('user', { loginAt: { $gte: last24Hours } }),
      LoginHistory.distinct('user', { loginAt: { $gte: last7Days } }),
      LoginHistory.distinct('user', { loginAt: { $gte: last30Days } }),
    ]);

    const statusCounts = usersByStatus.reduce((acc, current) => {
      acc[current._id] = current.count;
      return acc;
    }, {});

    const stats = {
      totalUsers,
      totalPosts,
      usersByStatus: statusCounts,
      // On renvoie simplement le nombre d'éléments dans les tableaux d'utilisateurs uniques
      activeUsers: {
        daily: activeUsers24h.length,
        weekly: activeUsers7d.length,
        monthly: activeUsers30d.length,
      },
    };

    res.json(stats);

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
};

module.exports = { getStats };
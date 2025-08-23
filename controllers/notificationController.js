// controllers/notificationController.js
const Notification = require('../models/Notification');

// @desc    Récupérer les notifications d'un utilisateur (admin)
// @route   GET /api/notifications
// @access  Privé/Admin
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 }) // Les plus récentes en premier
      .limit(50); // On limite pour ne pas surcharger

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la récupération des notifications.', error: error.message });
  }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/notifications/:id/read
// @access  Privé/Admin
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id, // Sécurité: on s'assure que la notif appartient bien à l'utilisateur connecté
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée.' });
    }

    if (notification.read) {
      return res.json(notification); // Déjà lue, on ne fait rien
    }

    notification.read = true;
    const updatedNotification = await notification.save();

    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la mise à jour de la notification.', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
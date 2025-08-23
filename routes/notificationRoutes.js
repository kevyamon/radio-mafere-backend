// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Toutes les routes ici sont pour les admins connectés
router.use(protect, admin);

// GET /api/notifications -> Récupérer toutes les notifications de l'admin
router.route('/').get(getNotifications);

// PUT /api/notifications/:id/read -> Marquer une notification comme lue
router.route('/:id/read').put(markAsRead);

module.exports = router;
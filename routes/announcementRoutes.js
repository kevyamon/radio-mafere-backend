// routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getApprovedAnnouncements,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

// Route pour récupérer toutes les annonces approuvées (publique)
// GET /api/announcements
router.route('/').get(getApprovedAnnouncements);

// Route pour qu'un utilisateur crée une nouvelle annonce (protégée)
// POST /api/announcements
router.route('/').post(protect, createAnnouncement);

module.exports = router;
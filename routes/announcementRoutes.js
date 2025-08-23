// routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getApprovedAnnouncements,
  getPendingAnnouncements,   // <-- On importe les nouvelles fonctions
  updateAnnouncementStatus, // <-- On importe les nouvelles fonctions
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware'); // <-- On importe le middleware admin
const upload = require('../config/cloudinary');

// --- Routes Publiques ---
// GET /api/announcements -> Récupérer les annonces approuvées
router.route('/').get(getApprovedAnnouncements);

// --- Routes pour Utilisateurs Connectés ---
// POST /api/announcements -> Créer une nouvelle annonce
router.route('/').post(protect, upload.array('images', 5), createAnnouncement);

// --- Routes pour Administrateurs ---
// GET /api/announcements/pending -> Récupérer les annonces en attente de modération
router.route('/pending').get(protect, admin, getPendingAnnouncements);

// PUT /api/announcements/:id/status -> Approuver ou rejeter une annonce
router.route('/:id/status').put(protect, admin, updateAnnouncementStatus);

module.exports = router;
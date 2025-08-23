// routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getApprovedAnnouncements,
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary'); // <-- On importe notre middleware d'upload

// Route pour récupérer toutes les annonces approuvées (publique)
// GET /api/announcements
router.route('/').get(getApprovedAnnouncements);

// Route pour qu'un utilisateur crée une nouvelle annonce (protégée)
// POST /api/announcements
// On ajoute le middleware d'upload. 'images' est le nom du champ, 5 est le nombre max de fichiers.
router.route('/').post(protect, upload.array('images', 5), createAnnouncement); // <-- LIGNE MODIFIÉE

module.exports = router;
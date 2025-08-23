// routes/advertisementRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAdvertisement,
  getActiveAdvertisements,
  recordClick,
} = require('../controllers/advertisementController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../config/cloudinary');

// --- Routes Publiques ---
// GET /api/advertisements -> Récupérer les publicités actives
router.route('/').get(getActiveAdvertisements);
// GET /api/advertisements/:id/click -> Enregistrer un clic et rediriger
router.route('/:id/click').get(recordClick);

// --- Routes pour Administrateurs ---
// POST /api/advertisements -> Créer une nouvelle publicité
// On utilise upload.single() car on ne s'attend qu'à une seule image par pub
router.route('/').post(protect, admin, upload.single('image'), createAdvertisement);

module.exports = router;
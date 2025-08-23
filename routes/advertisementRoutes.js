// routes/advertisementRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAdvertisement,
  getActiveAdvertisements,
  recordClick,
  updateAdvertisement, // <-- On importe
  deleteAdvertisement, // <-- On importe
} = require('../controllers/advertisementController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../config/cloudinary');

// --- Routes Publiques ---
router.route('/').get(getActiveAdvertisements);
router.route('/:id/click').get(recordClick);

// --- Routes pour Administrateurs ---
router.route('/').post(protect, admin, upload.single('image'), createAdvertisement);

// NOUVELLES ROUTES POUR LA GESTION
router.route('/:id')
  .put(protect, admin, upload.single('image'), updateAdvertisement) // Pour modifier
  .delete(protect, admin, deleteAdvertisement); // Pour supprimer

module.exports = router;
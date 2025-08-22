// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// GET /api/stats -> Récupérer toutes les statistiques
router.route('/').get(protect, admin, getStats);

module.exports = router;
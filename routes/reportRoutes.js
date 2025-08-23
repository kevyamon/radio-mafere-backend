// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { generateWeeklyReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// GET /api/reports/weekly -> Télécharger le rapport PDF
// La route est protégée et réservée aux admins
router.route('/weekly').get(protect, admin, generateWeeklyReport);

module.exports = router;
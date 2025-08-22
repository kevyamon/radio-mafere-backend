// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const {
  createEvent,
  getUpcomingEvents,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Route pour récupérer tous les événements (publique)
// GET /api/events
router.route('/').get(getUpcomingEvents);

// Route pour créer un nouvel événement (protégée et réservée aux admins)
// POST /api/events
router.route('/').post(protect, admin, createEvent);

module.exports = router;
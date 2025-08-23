// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const {
  createEvent,
  getUpcomingEvents,
  toggleParticipation, // <-- On importe la nouvelle fonction
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Route pour récupérer tous les événements (publique)
// GET /api/events
router.route('/').get(getUpcomingEvents);

// Route pour créer un nouvel événement (protégée et réservée aux admins)
// POST /api/events
router.route('/').post(protect, admin, createEvent);

// Route pour s'inscrire ou se désinscrire d'un événement (protégée pour les utilisateurs connectés)
// PUT /api/events/:id/participate
router.route('/:id/participate').put(protect, toggleParticipation); // <-- NOUVELLE LIGNE

module.exports = router;
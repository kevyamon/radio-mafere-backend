// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const { pingLocation } = require('../controllers/locationController');

// @route   POST /api/location/ping
// @desc    Permet au frontend de signaler une "présence" pour l'afficher sur la carte
router.post('/ping', pingLocation);

module.exports = router;
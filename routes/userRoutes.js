// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// GET /api/users -> Récupérer tous les utilisateurs
router.route('/').get(protect, admin, getAllUsers);

// PUT /api/users/:id/status -> Mettre à jour le statut d'un utilisateur
router.route('/:id/status').put(protect, admin, updateUserStatus); // NOUVELLE ROUTE

module.exports = router;
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// On applique les deux middlewares. La requête passera d'abord par `protect`,
// puis si c'est bon, par `admin`, avant d'arriver à `getAllUsers`.
router.route('/').get(protect, admin, getAllUsers);

module.exports = router;
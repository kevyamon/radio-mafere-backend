// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupère le token de l'en-tête (ex: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Vérifie et décode le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trouve l'utilisateur correspondant à l'ID du token
      // et l'attache à l'objet de la requête pour qu'il soit disponible dans les contrôleurs
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Passe à l'étape suivante (le contrôleur)
    } catch (error) {
      res.status(401).json({ message: 'Non autorisé, le token a échoué' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Non autorisé, pas de token' });
  }
};

module.exports = { protect };
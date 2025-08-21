// middleware/adminMiddleware.js
const admin = (req, res, next) => {
  // Ce middleware doit être utilisé APRÈS le middleware "protect"
  // car "protect" attache l'objet "user" à la requête (req)
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next(); // L'utilisateur est admin, on le laisse passer
  } else {
    res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas administrateur.' });
  }
};

module.exports = { admin };
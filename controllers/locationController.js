// controllers/locationController.js
const axios = require('axios');
const { getIo } = require('../socket');

// @desc    Enregistrer et diffuser la localisation d'un utilisateur
// @route   POST /api/location/ping
// @access  Public
const pingLocation = async (req, res) => {
  try {
    // On récupère l'IP de l'utilisateur. On prend en compte les proxys (comme sur Render.com)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // On utilise un service gratuit de géolocalisation par IP.
    // Note : En production, il faudrait une clé API pour un service plus robuste.
    const geoResponse = await axios.get(`http://ip-api.com/json/${ip}?fields=status,lat,lon`);

    if (geoResponse.data && geoResponse.data.status === 'success') {
      const { lat, lon } = geoResponse.data;

      // On ajoute un "flou" aléatoire pour la confidentialité
      const latOffset = (Math.random() - 0.5) * 0.1; // ~11km de flou
      const lonOffset = (Math.random() - 0.5) * 0.1;

      const locationData = {
        lat: lat + latOffset,
        lon: lon + lonOffset,
        // On ajoute un ID unique pour que React puisse gérer l'animation
        id: `ping-${Date.now()}-${Math.random()}` 
      };

      // On diffuse à tout le monde (sauf l'expéditeur) qu'un nouvel auditeur est là
      getIo().emit('new_listener_location', locationData);

      res.status(200).json({ message: 'Pong' });
    } else {
      res.status(404).json({ message: 'Localisation non trouvée.' });
    }
  } catch (error) {
    // On n'affiche pas l'erreur en public pour ne pas révéler d'infos
    console.error('Erreur de géolocalisation:', error.message);
    res.status(500).json({ message: 'Erreur interne.' });
  }
};

module.exports = {
  pingLocation,
};
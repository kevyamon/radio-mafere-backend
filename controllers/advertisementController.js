// controllers/advertisementController.js
const Advertisement = require('../models/Advertisement');
const upload = require('../config/cloudinary');

// @desc    Créer une nouvelle publicité (réservé aux admins)
// @route   POST /api/advertisements
// @access  Privé/Admin
const createAdvertisement = async (req, res) => {
  const { companyName, targetUrl } = req.body;

  if (!companyName || !targetUrl) {
    return res.status(400).json({ message: 'Veuillez fournir un nom d\'entreprise et une URL de destination.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Veuillez fournir une image pour la publicité.' });
  }

  try {
    const newAd = new Advertisement({
      companyName,
      targetUrl,
      imageUrl: req.file.path, // L'URL de l'image renvoyée par Cloudinary
    });

    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la création de la publicité.', error: error.message });
  }
};

// @desc    Récupérer toutes les publicités actives
// @route   GET /api/advertisements
// @access  Public
const getActiveAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ status: 'active' });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la récupération des publicités.', error: error.message });
  }
};

// @desc    Incrémenter le compteur de clics pour une publicité
// @route   GET /api/advertisements/:id/click
// @access  Public
const recordClick = async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        if (!ad) {
            // Si la pub n'existe pas, on redirige vers la page d'accueil pour éviter un crash
            return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
        }
        
        ad.clicks += 1;
        await ad.save();

        // --- CORRECTION CLÉ ---
        // On s'assure que l'URL est absolue avant de rediriger
        let destinationUrl = ad.targetUrl;
        if (!/^https?:\/\//i.test(destinationUrl)) {
            destinationUrl = `https://${destinationUrl}`;
        }
        
        res.redirect(destinationUrl);

    } catch (error) {
        // En cas d'erreur, on redirige aussi pour ne pas bloquer l'utilisateur
        console.error("Erreur lors de l'enregistrement du clic:", error);
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    }
};

module.exports = {
  createAdvertisement,
  getActiveAdvertisements,
  recordClick,
};
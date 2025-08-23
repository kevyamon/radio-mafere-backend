// controllers/advertisementController.js
const Advertisement = require('../models/Advertisement');
const cloudinary = require('cloudinary').v2; // On importe cloudinary pour pouvoir supprimer des images

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
      imageUrl: req.file.path,
      // NOUVEAU : On sauvegarde aussi le public_id pour la suppression future
      imagePublicId: req.file.filename, 
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
            return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
        }
        
        ad.clicks += 1;
        await ad.save();

        let destinationUrl = ad.targetUrl;
        if (!/^https?:\/\//i.test(destinationUrl)) {
            destinationUrl = `https://${destinationUrl}`;
        }
        
        res.redirect(destinationUrl);
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du clic:", error);
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    }
};

// --- NOUVELLES FONCTIONS ---

// @desc    Supprimer une publicité
// @route   DELETE /api/advertisements/:id
// @access  Privé/Admin
const deleteAdvertisement = async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Publicité non trouvée.' });
        }

        // 1. Supprimer l'image de Cloudinary
        if (ad.imagePublicId) {
            await cloudinary.uploader.destroy(ad.imagePublicId);
        }

        // 2. Supprimer la pub de la base de données
        await ad.deleteOne();

        res.json({ message: 'Publicité supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
    }
};

// @desc    Modifier une publicité
// @route   PUT /api/advertisements/:id
// @access  Privé/Admin
const updateAdvertisement = async (req, res) => {
    try {
        const { companyName, targetUrl, status } = req.body;
        const ad = await Advertisement.findById(req.params.id);

        if (!ad) {
            return res.status(404).json({ message: 'Publicité non trouvée.' });
        }

        ad.companyName = companyName || ad.companyName;
        ad.targetUrl = targetUrl || ad.targetUrl;
        ad.status = status || ad.status;

        // Gérer le changement d'image (optionnel)
        if (req.file) {
            // Supprimer l'ancienne image
            if (ad.imagePublicId) {
                await cloudinary.uploader.destroy(ad.imagePublicId);
            }
            // Mettre à jour avec la nouvelle
            ad.imageUrl = req.file.path;
            ad.imagePublicId = req.file.filename;
        }

        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
    }
};

module.exports = {
  createAdvertisement,
  getActiveAdvertisements,
  recordClick,
  deleteAdvertisement, // <-- On exporte
  updateAdvertisement, // <-- On exporte
};
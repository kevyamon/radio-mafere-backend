// controllers/announcementController.js
const Announcement = require('../models/Announcement');

// @desc    Créer une nouvelle annonce
// @route   POST /api/announcements
// @access  Privé (utilisateur connecté)
const createAnnouncement = async (req, res) => {
  const { title, content, category, contactInfo } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires (titre, contenu, catégorie).' });
  }

  try {
    const announcement = new Announcement({
      title,
      content,
      category,
      contactInfo,
      author: req.user._id,
    });

    const createdAnnouncement = await announcement.save();
    // On pourrait notifier les admins ici via Socket.IO dans une future version
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur lors de la création de l'annonce.", error: error.message });
  }
};

// @desc    Récupérer toutes les annonces approuvées
// @route   GET /api/announcements
// @access  Public
const getApprovedAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'approuvée' })
      .populate('author', 'prenom username')
      .sort({ createdAt: 'desc' });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la récupération des annonces.', error: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getApprovedAnnouncements,
};
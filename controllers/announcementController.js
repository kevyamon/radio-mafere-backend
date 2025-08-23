// controllers/announcementController.js
const Announcement = require('../models/Announcement');
const { getIo, emitToUser } = require('../socket'); // On importe les outils socket.io

// @desc    Créer une nouvelle annonce
// @route   POST /api/announcements
// @access  Privé (utilisateur connecté)
const createAnnouncement = async (req, res) => {
  const { title, content, category, contactInfo } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires (titre, contenu, catégorie).' });
  }

  try {
    const images = req.files ? req.files.map(file => ({ url: file.path, public_id: file.filename })) : [];

    const announcement = new Announcement({
      title,
      content,
      category,
      contactInfo,
      images,
      author: req.user._id,
    });

    const createdAnnouncement = await announcement.save();

    // --- TEMPS RÉEL ---
    // On notifie tous les admins qu'une nouvelle annonce est en attente
    const populatedAnnouncement = await Announcement.findById(createdAnnouncement._id).populate('author', 'prenom');
    getIo().to('admins').emit('new_pending_announcement', populatedAnnouncement);
    // --- FIN TEMPS RÉEL ---

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

// --- NOUVELLES FONCTIONS DE MODÉRATION ---

// @desc    Récupérer toutes les annonces en attente
// @route   GET /api/announcements/pending
// @access  Privé (Admin)
const getPendingAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'en_attente' })
      .populate('author', 'prenom username')
      .sort({ createdAt: 'asc' }); // Les plus anciennes en premier

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
  }
};

// @desc    Mettre à jour le statut d'une annonce (approuver/rejeter)
// @route   PUT /api/announcements/:id/status
// @access  Privé (Admin)
const updateAnnouncementStatus = async (req, res) => {
  const { status } = req.body;

  if (!['approuvée', 'rejetée'].includes(status)) {
    return res.status(400).json({ message: 'Statut invalide.' });
  }

  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    announcement.status = status;
    await announcement.save();

    // --- TEMPS RÉEL ---
    // On notifie l'auteur que le statut de son annonce a changé
    const notification = {
        message: `Votre annonce "${announcement.title.substring(0, 20)}..." a été ${status}.`,
        status: status
    };
    emitToUser(announcement.author.toString(), 'announcement_status_updated', notification);
    // --- FIN TEMPS RÉEL ---

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
  }
};


module.exports = {
  createAnnouncement,
  getApprovedAnnouncements,
  getPendingAnnouncements,    // <-- Export
  updateAnnouncementStatus,   // <-- Export
};
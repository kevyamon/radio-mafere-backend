// controllers/eventController.js
const Event = require('../models/Event');

// @desc    Créer un nouvel événement
// @route   POST /api/events
// @access  Privé/Admin
const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  if (!title || !description || !date) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires (titre, description, date).' });
  }

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      author: req.user._id, // L'ID de l'admin qui crée l'événement
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur lors de la création de l'événement.", error: error.message });
  }
};

// @desc    Récupérer tous les événements à venir
// @route   GET /api/events
// @access  Public
const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } }) // On ne prend que les événements dont la date est future ou aujourd'hui
      .populate('author', 'prenom nom') // On récupère le prénom et nom de l'auteur
      .populate('participants', 'prenom nom') // Et ceux des participants
      .sort({ date: 'asc' }); // On les trie du plus proche au plus lointain

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur lors de la récupération des événements.', error: error.message });
  }
};

// @desc    Participer ou se désinscrire d'un événement
// @route   PUT /api/events/:id/participate
// @access  Privé (pour les utilisateurs connectés)
const toggleParticipation = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    // On vérifie si l'utilisateur participe déjà
    const isParticipating = event.participants.some(participantId => participantId.toString() === req.user._id.toString());

    if (isParticipating) {
      // Si oui, on le retire de la liste
      event.participants = event.participants.filter(participantId => participantId.toString() !== req.user._id.toString());
    } else {
      // Sinon, on l'ajoute à la liste
      event.participants.push(req.user._id);
    }

    const updatedEvent = await event.save();
    
    // On re-popule les participants pour renvoyer une liste complète au frontend
    await updatedEvent.populate('participants', 'prenom nom');

    res.json(updatedEvent);

  } catch (error) {
    res.status(500).json({ message: "Erreur du serveur.", error: error.message });
  }
};


module.exports = {
  createEvent,
  getUpcomingEvents,
  toggleParticipation, // <-- On exporte la nouvelle fonction
};
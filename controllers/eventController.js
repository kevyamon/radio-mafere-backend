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

module.exports = {
  createEvent,
  getUpcomingEvents,
};
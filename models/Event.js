// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: false, // Le lieu peut être optionnel (ex: événement en ligne)
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Qui a créé l'événement (un admin)
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // La liste des utilisateurs qui participent
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
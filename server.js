// 1. Importation des dépendances
require('dotenv').config(); // Charge les variables d'environnement du fichier .env
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 2. Initialisation de l'application Express
const app = express();
// Render fournit son propre port via process.env.PORT
const PORT = process.env.PORT || 5005; 

// 3. Configuration des Middlewares
// Active CORS pour autoriser les requêtes depuis le frontend
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'], // Autorise le dev local et plus tard le site en production
  credentials: true,
}));

// Permet à Express de comprendre les requêtes envoyées en format JSON
app.use(express.json());

// 4. Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.error('❌ Erreur de connexion à MongoDB :', err));

// 5. Route de test pour vérifier que le serveur fonctionne
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur l\'API de Radio Maféré ! Le serveur fonctionne.' });
});

// 6. Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Le serveur de Radio Maféré écoute sur le port ${PORT}`);
});
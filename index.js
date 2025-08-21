// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// On importe les routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // NOUVELLE ROUTE

const app = express();
const PORT = process.env.PORT || 5005; 

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.error('❌ Erreur de connexion à MongoDB :', err));

// Route de test
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur l\'API de Radio Maféré !' });
});

// On dit à Express d'utiliser nos routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); // NOUVEAU

app.listen(PORT, () => {
  console.log(`🚀 Le serveur de Radio Maféré écoute sur le port ${PORT}`);
});
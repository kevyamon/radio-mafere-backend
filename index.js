// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { initSocket } = require('./socket');

// On importe les routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes'); // <-- NOUVELLE LIGNE

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

const PORT = process.env.PORT || 5005;

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((err) => console.error('❌ Erreur de connexion à MongoDB :', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes); // <-- NOUVELLE LIGNE

server.listen(PORT, () => {
  console.log(`🚀 Le serveur de Radio Maféré écoute sur le port ${PORT}`);
});
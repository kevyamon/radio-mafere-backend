// socket.js
let io;

const initSocket = (httpServer) => {
  io = require('socket.io')(httpServer, {
    cors: {
      origin: ['http://localhost:5173', process.env.FRONTEND_URL],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Nouvel appareil connecté: ${socket.id}`);

    // Quand un utilisateur s'identifie, on le fait rejoindre son salon privé
    socket.on('user_connected', (userId) => {
      socket.join(userId);
      console.log(`🔗 Appareil ${socket.id} a rejoint le salon de l'utilisateur ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Appareil déconnecté: ${socket.id}`);
      // Socket.IO gère automatiquement le départ des salons lors de la déconnexion
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Fonction pour envoyer un événement à tous les appareils d'un utilisateur
const emitToUser = (userId, event, data) => {
  // On diffuse l'événement dans le salon de l'utilisateur
  getIo().to(userId).emit(event, data);
  console.log(`🚀 Diffusion de l'événement '${event}' dans le salon de l'utilisateur ${userId}`);
};

module.exports = { initSocket, getIo, emitToUser };
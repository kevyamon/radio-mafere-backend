// socket.js
let io;
let connectedUsers = {}; // Objet pour mapper userId -> socketId

const initSocket = (httpServer) => {
  io = require('socket.io')(httpServer, {
    cors: {
      origin: ['http://localhost:5173', process.env.FRONTEND_URL],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Nouvel utilisateur connecté: ${socket.id}`);

    // Quand un utilisateur s'identifie après la connexion
    socket.on('user_connected', (userId) => {
      console.log(`🔗 Utilisateur ${userId} associé au socket ${socket.id}`);
      connectedUsers[userId] = socket.id;
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Utilisateur déconnecté: ${socket.id}`);
      // On le retire de notre liste d'utilisateurs connectés
      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
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

// Fonction pour envoyer un événement à un utilisateur spécifique
const emitToUser = (userId, event, data) => {
  const socketId = connectedUsers[userId];
  if (socketId) {
    getIo().to(socketId).emit(event, data);
    console.log(`🚀 Envoi de l'événement '${event}' à l'utilisateur ${userId}`);
    return true;
  }
  console.log(`- Utilisateur ${userId} non trouvé ou non connecté.`);
  return false;
};

module.exports = { initSocket, getIo, emitToUser };
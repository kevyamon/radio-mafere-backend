// socket.js
const User = require('./models/User'); // On a besoin du modèle User pour vérifier le rôle

let io;

const initSocket = (httpServer) => {
  io = require('socket.io')(httpServer, {
    cors: {
      origin: ['http://localhost:5173', process.env.FRONTEND_URL, process.env.FRONTEND_URL_RENDER],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Nouvel appareil connecté: ${socket.id}`);

    // Quand un utilisateur s'identifie, on le fait rejoindre ses salons
    socket.on('user_connected', async (userId) => {
      // 1. Il rejoint son salon personnel (pour les notifications privées)
      socket.join(userId);
      console.log(`🔗 Appareil ${socket.id} a rejoint le salon personnel de l'utilisateur ${userId}`);

      // 2. NOUVEAU : On vérifie s'il est admin
      try {
        const user = await User.findById(userId);
        if (user && (user.role === 'admin' || user.role === 'super_admin')) {
          // Si oui, il rejoint le salon des admins
          socket.join('admins');
          console.log(`👑 Appareil ${socket.id} a rejoint le salon des admins.`);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle de l'utilisateur:", error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Appareil déconnecté: ${socket.id}`);
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

const emitToUser = (userId, event, data) => {
  getIo().to(userId).emit(event, data);
  console.log(`🚀 Diffusion de l'événement '${event}' dans le salon de l'utilisateur ${userId}`);
};

module.exports = { initSocket, getIo, emitToUser };
const { Server } = require('socket.io');

class ChatServer {
  io = null;

  constructor(httpServer) {
    this.io = new Server(httpServer);
  }

  start() {
    this.io.on('connection', (socket) => {
      console.log('new user connected');
    });
  }
}

module.exports = ChatServer;

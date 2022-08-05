const { format } = require('date-fns');
const { Server } = require('socket.io');

class ChatServer {
  io = null;

  constructor(httpServer) {
    this.io = new Server(httpServer);
  }

  start() {
    this.io.on('connection', (socket) => {
      console.log(`new user: ${socket.id} connected`);
      this.io.emit('logs', this.createLogMessage(`A new user (${socket.id}) has connected`));

      socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
        this.io.emit('logs', this.createLogMessage(`A user (${socket.id}) has disconnected`));
      });
    });
  }

  createLogMessage(message) {
    const currDate = new Date();
    const formattedDate = format(currDate, 'dd-MM-yyyy kk:mm:ss');
    return {
      date: formattedDate,
      message,
    };
  }
}

module.exports = ChatServer;

const { format } = require('date-fns');
const { Server } = require('socket.io');

class ChatServer {
  io = null;
  users = [];

  constructor(httpServer) {
    this.io = new Server(httpServer);
  }

  start() {
    this.io.on('connection', (socket) => {
      socket.emit('initialize-data', this.users);

      socket.on('user-join', (clientUser) => {
        const user = this.users.find((u) => u.username === clientUser.username);

        if (!user) {
          this.users.push({
            id: socket.id,
            username: clientUser.username,
            name: clientUser.name,
            online: true,
          });
        } else {
          user.id = socket.id;
          user.online = true;
        }

        this.io.emit(
          'logs',
          this.createLogMessage(`${clientUser.name} (${clientUser.username}) has joined.`),
        );
        this.io.emit('sync-data', this.users);
      });

      socket.on('logs', (logData) => {
        this.io.emit('logs', this.createLogMessage(logData.message));
      });

      socket.on('disconnect', () => {
        const idx = this.users.findIndex((u) => u.id === socket.id);
        const user = this.users[idx];
        if (user) {
          user.online = false;
          this.io.emit('logs', this.createLogMessage(`${user.name} (${user.username}) has left.`));
        }

        this.io.emit('sync-data', this.users);
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

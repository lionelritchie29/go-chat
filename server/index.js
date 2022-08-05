const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const ChatServer = require('./chat-server');

app.use(express.static(path.join(__dirname, '/../client')));

app.get('/', (req, res) => {
  const file = path.resolve(__dirname + '/../client/index.html');
  res.sendFile(file);
});

const chatServer = new ChatServer(server);
chatServer.start();

server.listen(3000, () => {
  console.log('listening on *:3000');
});

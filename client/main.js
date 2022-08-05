import { getUserInputData } from './get-user-data.js';
let serverUsers = [];

let currentUser = {
  username: '',
  name: '',
  online: false,
};

window.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  initialize(socket);

  socket.on('sync-data', (users) => {
    console.log(users);
    serverUsers = users;
  });

  socket.on('disconnect', () => {
    socket.emit('user-left', currentUser);
  });

  listenAndHandleLogEvent(socket);
});

const initialize = (socket) => {
  socket.once('initialize-data', (users) => {
    serverUsers = users;

    let existUser = null;
    while (true) {
      const loginUsername = prompt('Input your username: ');
      existUser = users.find((u) => u.username === loginUsername);
      if (!existUser) break;
      if (!existUser.online) break;
      if (existUser.online) {
        alert('ups, user with that username is already online');
      }
    }

    if (existUser) {
      currentUser = existUser;
    } else {
      const { username, name } = getUserInputData(users);
      currentUser.username = username;
      currentUser.name = name;
    }
    socket.emit('user-join', currentUser);
  });
};

const listenAndHandleLogEvent = (socket) => {
  socket.on('logs', (logData) => {
    const logList = document.getElementById('logs');
    const logItem = document.createElement('li');
    logItem.classList.add('text-xs', 'border-b', 'mb-2', 'pb-2');
    logItem.innerHTML += `<p class="text-blue-600">[${logData.date}]</p>`;
    logItem.innerHTML += `<p class="text-gray-600">${logData.message}</p>`;
    logList.prepend(logItem);
  });
};

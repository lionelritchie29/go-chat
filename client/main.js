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
  listenAndHandleSyncEvent(socket);
  listenAndHandleLogEvent(socket);
});

const initialize = (socket) => {
  socket.once('initialize-data', (users) => {
    serverUsers = users;
    const { username, name, existUser } = getUserInputData(users);

    if (existUser) {
      currentUser = existUser;
    } else {
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

const listenAndHandleSyncEvent = (socket) => {
  socket.on('sync-data', (users) => {
    serverUsers = users;

    const userContainer = document.getElementById('users-container');
    const userCardTemplate = document.getElementById('user-card-template');

    userContainer.innerHTML = '';
    users.forEach((user) => {
      const userCard = userCardTemplate.content.cloneNode(true);
      userCard.querySelector('li').title = `username: ${user.username}`;
      userCard.getElementById('user-card-name').innerText = user.name;
      if (user.online) {
        userCard.getElementById('user-card-status').classList.add('bg-green-600');
      } else {
        userCard.getElementById('user-card-status').classList.add('bg-gray-600');
      }
      userContainer.appendChild(userCard);
    });
  });
};

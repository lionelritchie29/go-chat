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
  handleChatSend(socket);
  listenAndHandleGlobalChatEvent(socket);
});

const initialize = (socket) => {
  socket.once('initialize-data', (users) => {
    serverUsers = users;
    const { username, name, existUser } = getUserInputData(users);

    if (existUser) {
      currentUser = existUser;
    } else {
      currentUser.id = socket.id;
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

const handleChatSend = (socket) => {
  const form = document.getElementById('chat-input');
  form.onsubmit = (event) => {
    event.preventDefault();
    const message = form.querySelector('input').value;
    if (message) {
      socket.emit('global-chat', { from: currentUser, message });
      form.querySelector('input').value = '';
    }
  };
};

const listenAndHandleGlobalChatEvent = (socket) => {
  const chatMessagesList = document.getElementById('chat-messages');
  const otherChatBubbleTemplate = document.getElementById('other-chat-bubble');
  const myChatBubbleTemplate = document.getElementById('my-chat-bubble');

  socket.on('global-chat', ({ from, message, time }) => {
    if (from.username === currentUser.username) {
      const myChatBubble = myChatBubbleTemplate.content.cloneNode(true);
      myChatBubble.getElementById('my-chat-bubble-msg').innerText = message;
      myChatBubble.getElementById('my-chat-bubble-time').innerText = time;
      chatMessagesList.appendChild(myChatBubble);
    } else {
      const otherChatBubble = otherChatBubbleTemplate.content.cloneNode(true);
      otherChatBubble.getElementById('other-chat-bubble-name').innerText = from.name;
      otherChatBubble.getElementById('other-chat-bubble-msg').innerText = message;
      otherChatBubble.getElementById('other-chat-bubble-time').innerText = time;
      chatMessagesList.appendChild(otherChatBubble);
    }
  });
};

const socket = io();
console.log('test');

socket.on('connect', () => {
  console.log('connected');
});

socket.on('logs', (logData) => {
  const logList = document.getElementById('logs');
  const logItem = document.createElement('li');
  logItem.classList.add('text-xs', 'border-b', 'mb-2', 'pb-2');
  logItem.innerHTML += `<p class="text-blue-600">[${logData.date}]</p>`;
  logItem.innerHTML += `<p class="text-gray-600">${logData.message}</p>`;
  logList.prepend(logItem);
});

socket.onAny((eventName, ...args) => {
  console.log(eventName);
});

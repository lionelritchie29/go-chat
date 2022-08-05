export const getUserInputData = (users) => {
  let username = '';
  let name = '';

  const validation = {
    username: false,
    name: false,
  };

  while (!validation.username) {
    username = prompt('Input username (no space, max 12 characters):');
    if (username && username.length <= 12 && !username.includes(' ')) {
      if (users.find((u) => u.username === username)) {
        alert('Ups, username already exist');
      } else {
        validation.username = true;
      }
    }
  }

  while (!validation.name) {
    name = prompt('Input name (max 24 characters): ');
    if (name && name.length <= 24) {
      validation.name = true;
    }
  }

  return { username, name };
};

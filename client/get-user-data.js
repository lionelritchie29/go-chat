export const getUserInputData = (users) => {
  let username = '';
  let name = '';
  let existUser = null;

  while (true) {
    username = getAndValidateUsername(users);
    existUser = users.find((u) => u.username === username);
    if (!existUser) break;
    if (!existUser.online) break;
    if (existUser.online) {
      alert('ups, user with that username is already online');
    }
  }

  if (!existUser) {
    name = getAndValidateName();
  }

  return { username, name, existUser };
};

const getAndValidateUsername = (users) => {
  let username = '';
  while (true) {
    username = prompt('Input username (no space, max 12 characters):');
    if (username && username.length <= 12 && !username.includes(' ')) {
      break;
    }
  }

  return username;
};

const getAndValidateName = () => {
  let name = '';
  while (true) {
    name = prompt('Input name (max 24 characters): ');
    if (name && name.length <= 24) {
      break;
    }
  }
  return name;
};

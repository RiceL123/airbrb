import config from './config.json';

export const apiCall = (method, token, path, body) => {
  return fetch(`http://localhost:${config.BACKEND_PORT}${path}`, {
    method,
    headers: {
      'Content-type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(body)
  });
}

export const generateRandomId = () => {
  // Random 6 digit id
  return 100000 + Math.floor(Math.random() * 900000);
}

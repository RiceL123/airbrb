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

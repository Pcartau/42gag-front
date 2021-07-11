import axios from 'axios';

const url = 'https://gag42.herokuapp.com/' // 'http://localhost:8000';

export async function login(code) {
  return axios.post(`${url}/auth`, { code })
  .then((res) => res.data)
  .catch(() => false)
}

export async function getHomePageImages(page=0) {
  const token = document.cookie?.split('=')[1];

  return axios.get(`${url}/homepage/${page}`, {headers: { Authorization: `Bearer ${token}`}})
  .then((res) => res.data)
  .catch(() => false);
}

export function postImage(title, hidden, base64) {
  const token = document.cookie?.split('=')[1];

  return axios.post(`${url}/image`, {title, base64, hidden}, {headers: { Authorization: `Bearer ${token}`}})
  .then(() => true)
  .catch(() => false);
}

export function likeImage(image_id) {
  const token = document.cookie?.split('=')[1];

  return axios.post(`${url}/like/${image_id}`, {}, {headers: { Authorization: `Bearer ${token}`}})
  .then(() => true)
  .catch(() => false);
}
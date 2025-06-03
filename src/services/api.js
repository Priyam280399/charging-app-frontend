import axios from 'axios';

const API = axios.create({
  baseURL: 'https://charging-app-backend-one.onrender.com/api', // Update this
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;

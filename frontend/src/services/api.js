import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Crucial for cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;

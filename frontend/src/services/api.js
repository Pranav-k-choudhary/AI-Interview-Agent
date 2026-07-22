import axios from 'axios';

const API = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:5000/api'
      : 'https://ai-interview-agent-backend-ri2p.onrender.com/api',

  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
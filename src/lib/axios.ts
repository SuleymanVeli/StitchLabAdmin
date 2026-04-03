import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Next.js API routes üçün kök yol
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
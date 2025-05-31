import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Cambia esto cuando tengas tu backend real
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Update to match your backend's URL
  withCredentials: true, // Optional, if using cookies/session
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
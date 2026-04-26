import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to automatically add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem('userInfo');
    
    if (savedUser) {
      const { token } = JSON.parse(savedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Interceptor: adiciona JWT no header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sacrario_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: redireciona para login em 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sacrario_token');
      localStorage.removeItem('sacrario_usuario');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/definir-senha') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

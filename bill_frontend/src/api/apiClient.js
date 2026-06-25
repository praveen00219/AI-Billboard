import axios from 'axios';

const API_BASE_URL = 'http://localhost:2000/api';

// ─── Citizen API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Crucial for cookie-based auth
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('isauth');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
    return Promise.reject(error);
  }
);

// ─── Authority API Client 
export const authorityApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Crucial for cookie-based auth
});

authorityApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('isauth');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

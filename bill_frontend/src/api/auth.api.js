import apiClient from './apiClient';

export const authApi = {
  // Citizen Register
  citizenRegister: async (userData) => {
    const response = await apiClient.post('/auth/userAuth-register', userData);
    return response.data;
  },

  // Citizen Login
  citizenLogin: async (credentials) => {
    const response = await apiClient.post('/auth/userAuth-login', credentials);
    return response.data;
  },

  // Authority Login (if applicable)
  authorityLogin: async (credentials) => {
    const response = await apiClient.post('/auth/authorityAuth-login', credentials);
    return response.data;
  },

  // Authority Register (if applicable)
  authorityRegister: async (userData) => {
    const response = await apiClient.post('/auth/authorityAuth-register', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current user info
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

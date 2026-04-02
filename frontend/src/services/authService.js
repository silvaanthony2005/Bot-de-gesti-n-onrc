import api from '@/lib/api';
import { AUTH_TOKEN_KEY } from '@/lib/authStorage';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const payload = response.data;
    localStorage.setItem(AUTH_TOKEN_KEY, payload.access_token);
    return payload;
  },

  async register(fullName, email, password) {
    const response = await api.post('/auth/register', {
      full_name: fullName,
      email,
      password,
    });
    const payload = response.data;
    localStorage.setItem(AUTH_TOKEN_KEY, payload.access_token);
    return payload;
  },

  async me() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

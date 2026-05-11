import axios from 'axios';
import { API_CONFIG } from '../utils/constants';
import { TokenService } from './token.service';

/**
 * NODE.JS INTEGRATION NOTE:
 * This Axios instance is prepared for a real backend.
 * - It attaches the Bearer token to all requests automatically.
 * - It intercepts 401 Unauthorized responses to attempt a silent token refresh.
 * - If refresh fails, it clears the local session and forces a logout.
 */

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching the JWT
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling 401s and Refresh Token rotation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // IMPORTANT BACKEND CONCEPT:
    // When the backend returns 401 Token Expired, we catch it here.
    // We send the 'refresh_token' to get a new 'access_token'.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = TokenService.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        // Call the real refresh endpoint on the backend
        // const { data } = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, { token: refreshToken });
        // TokenService.setToken(data.accessToken);
        // api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        
        // originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        // return api(originalRequest);
        
        // MOCK BEHAVIOR: Just throw for now since we have no backend
        throw new Error('Refresh not implemented in mock');
      } catch (refreshError) {
        // If refresh fails, kill the session entirely
        TokenService.clearAll();
        window.location.href = '/login'; // Force redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

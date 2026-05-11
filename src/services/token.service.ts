import { AUTH_KEYS } from '../utils/constants';

export const TokenService = {
  getToken: () => localStorage.getItem(AUTH_KEYS.TOKEN),
  
  setToken: (token: string) => {
    localStorage.setItem(AUTH_KEYS.TOKEN, token);
  },
  
  removeToken: () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
  },

  getRefreshToken: () => localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN),
  
  setRefreshToken: (token: string) => {
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, token);
  },

  removeRefreshToken: () => {
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
  },

  clearAll: () => {
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER);
  }
};

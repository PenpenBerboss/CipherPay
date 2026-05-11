import { create } from 'zustand';
import { User } from '../types/auth.types';
import { TokenService } from '../services/token.service';

interface AuthStateProp {
  user: User | null;
  isAuthenticated: boolean;
  isMfaPending: boolean;
  mfaTempToken: string | null;
  isInitialized: boolean; // Flag to check if we restored session from local storage

  // Actions
  setAuth: (user: User, token: string) => void;
  setPendingMfa: (tempToken: string) => void;
  logout: () => void;
  initialize: () => void; // Call on app load to restore session
}

export const useAuthStore = create<AuthStateProp>((set) => ({
  user: null,
  isAuthenticated: false,
  isMfaPending: false,
  mfaTempToken: null,
  isInitialized: false,

  setAuth: (user, token) => {
    TokenService.setToken(token);
    // In a real app, you would also securely store the user info (or fetch it on app load using the token)
    localStorage.setItem('nc_usr_data', JSON.stringify(user));
    set({ user, isAuthenticated: true, isMfaPending: false, mfaTempToken: null });
  },

  setPendingMfa: (tempToken) => {
    set({ isMfaPending: true, mfaTempToken: tempToken, isAuthenticated: false, user: null });
  },

  logout: () => {
    TokenService.clearAll();
    set({ user: null, isAuthenticated: false, isMfaPending: false, mfaTempToken: null });
  },

  initialize: () => {
    try {
      const token = TokenService.getToken();
      const userDataStr = localStorage.getItem('nc_usr_data');
      if (token && userDataStr) {
        const user = JSON.parse(userDataStr);
        set({ user, isAuthenticated: true, isInitialized: true });
      } else {
        set({ isInitialized: true });
      }
    } catch {
      set({ isInitialized: true });
      TokenService.clearAll();
    }
  }
}));

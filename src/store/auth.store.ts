import { create } from 'zustand';
import TokenService from '../services/token.service';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  balance: number;
  totpEnabled: boolean;
  avatar?: string;
  securityScore?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  pendingMfaUserId: string | null;
  setAuth: (user: User, token: string) => void;
  setPendingMfa: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: TokenService.getUser(),
  token: TokenService.getToken(),
  isAuthenticated: !!TokenService.getToken() && !TokenService.isTokenExpired(),
  pendingMfaUserId: null,

  setAuth: (user, token) => {
    const enrichedUser = {
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      securityScore: user.totpEnabled ? 85 : 50,
    };
    TokenService.setToken(token);
    TokenService.setUser(enrichedUser);
    set({ token, user: enrichedUser, isAuthenticated: true, pendingMfaUserId: null });
  },

  setPendingMfa: (userId) => {
    set({ pendingMfaUserId: userId });
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, user: null, isAuthenticated: false, pendingMfaUserId: null });
    window.location.href = '/auth/register';
  },
}));

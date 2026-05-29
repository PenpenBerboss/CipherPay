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
  role: 'user' | 'admin';
  avatar?: string;
  securityScore?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  pendingMfaUserId: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setPendingMfa: (userId: string) => void;
  updateBalance: (balance: number) => void;
  updateProfile: (profile: Partial<Pick<User, 'email' | 'firstName' | 'lastName'>>) => void;
  logout: () => void;
}

const enrichUser = (user: User): User => ({
  ...user,
  name: user.name || `${user.firstName} ${user.lastName}`.trim(),
  securityScore: typeof user.securityScore === 'number' ? user.securityScore : user.totpEnabled ? 85 : 50,
});

const mergeStoredUser = (storedUser: unknown): User | null => {
  if (!storedUser || typeof storedUser !== 'object') return null;

  const candidate = storedUser as Partial<User> & {
    first_name?: string;
    last_name?: string;
    totp_enabled?: boolean;
    securityScore?: number;
    role?: 'user' | 'admin';
  };

  const firstName = candidate.firstName || candidate.first_name;
  const lastName = candidate.lastName || candidate.last_name;

  if (!candidate.id || !candidate.email || !firstName || !lastName) return null;

  return enrichUser({
    id: candidate.id,
    email: candidate.email,
    firstName,
    lastName,
    name: candidate.name,
    balance: Number(candidate.balance ?? 0),
    totpEnabled: Boolean(candidate.totpEnabled ?? candidate.totp_enabled),
    role: candidate.role || 'user',
    avatar: candidate.avatar,
    securityScore: candidate.securityScore,
  });
};

const storedUser = mergeStoredUser(TokenService.getUser());

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: TokenService.getToken(),
  isAuthenticated: !!TokenService.getToken() && !TokenService.isTokenExpired(),
  pendingMfaUserId: null,

  setAuth: (user, token) => {
    const enrichedUser = enrichUser(user);
    TokenService.setToken(token);
    TokenService.setUser(enrichedUser);
    set({ token, user: enrichedUser, isAuthenticated: true, pendingMfaUserId: null });
  },

  setUser: (user) => {
    const enrichedUser = enrichUser(user);
    TokenService.setUser(enrichedUser);
    set({ user: enrichedUser });
  },

  setPendingMfa: (userId) => {
    set({ pendingMfaUserId: userId });
  },

  updateBalance: (balance) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = enrichUser({
        ...state.user,
        balance,
      });
      TokenService.setUser(updatedUser);
      return { user: updatedUser };
    });
  },

  updateProfile: (profile) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = enrichUser({
        ...state.user,
        ...profile,
        name: profile.firstName || profile.lastName
          ? `${profile.firstName ?? state.user.firstName} ${profile.lastName ?? state.user.lastName}`.trim()
          : state.user.name,
      });
      TokenService.setUser(updatedUser);
      return { user: updatedUser };
    });
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, user: null, isAuthenticated: false, pendingMfaUserId: null });
    window.location.href = '/auth/register';
  },
}));

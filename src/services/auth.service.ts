// src/services/auth.service.ts
import api from './api';
import TokenService from './token.service';

type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  totpEnabled: boolean;
  role: 'user' | 'admin';
  avatar?: string;
  securityScore?: number;
};

const normalizeUser = (user: any): AuthUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName ?? user.first_name,
  lastName: user.lastName ?? user.last_name,
  balance: Number(user.balance ?? 0),
  totpEnabled: Boolean(user.totpEnabled ?? user.totp_enabled),
  role: user.role || 'user',
  avatar: user.avatar,
  securityScore: user.securityScore,
});

const AuthService = {
  async register(data: { name: string; email: string; password: string; confirmPassword: string }) {
    const parts = data.name.trim().split(' ');
    const firstName = parts[0] || 'Utilisateur';
    const lastName = parts.slice(1).join(' ') || 'Inconnu';
    const res = await api.post('/auth/register', {
      email: data.email,
      password: data.password,
      firstName,
      lastName,
    });
    return res.data;
  },

  async login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;

    if (!data.requiresMfa && data.token && data.user) {
      TokenService.setToken(data.token);
      TokenService.setUser(normalizeUser(data.user));
    }

    return {
      requiresMfa: !!data.requiresMfa,
      userId: data.userId,
      role: data.role,
      token: data.token,
      user: data.user ? normalizeUser(data.user) : undefined,
    };
  },

  async verifyMfa(userId: string, otpCode: string) {
    const res = await api.post('/auth/mfa/verify', { userId, otpCode });
    const data = res.data;

    if (data.token && data.user) {
      TokenService.setToken(data.token);
      TokenService.setUser(normalizeUser(data.user));
    }

    return {
      ...data,
      user: data.user ? normalizeUser(data.user) : undefined,
    };
  },

  async setupMfa() {
    const res = await api.post('/auth/mfa/setup');
    return res.data as { secret: string; qrCode: string };
  },

  async confirmMfa(otpCode: string) {
    const res = await api.post('/auth/mfa/confirm', { otpCode });
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return normalizeUser(res.data.user);
  },

  async updateMe(data: { email?: string; firstName?: string; lastName?: string }) {
    const res = await api.put('/auth/me', data);
    return normalizeUser(res.data.user);
  },

  async listUsers(params: { search?: string; limit?: number; offset?: number } = {}) {
    const res = await api.get('/auth/admin/users', { params });
    return {
      ...res.data,
      users: (res.data.users || []).map(normalizeUser),
    };
  },

  async getUser(id: string) {
    const res = await api.get(`/auth/admin/users/${id}`);
    return normalizeUser(res.data.user);
  },

  async updateUser(
    id: string,
    data: Partial<Pick<AuthUser, 'email' | 'firstName' | 'lastName' | 'role'>> & {
      balance?: number;
      totpEnabled?: boolean;
      isLocked?: boolean;
    }
  ) {
    const res = await api.put(`/auth/admin/users/${id}`, data);
    return normalizeUser(res.data.user);
  },

  async deleteUser(id: string) {
    const res = await api.delete(`/auth/admin/users/${id}`);
    return res.data as { message: string };
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {}
    TokenService.clear();
    window.location.href = '/auth/login';
  },

  getCurrentUser() {
    return TokenService.getUser();
  },

  isAuthenticated(): boolean {
    return !!TokenService.getToken() && !TokenService.isTokenExpired();
  },
};

export { AuthService };
export default AuthService;

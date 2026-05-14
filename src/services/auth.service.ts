// src/services/auth.service.ts
import api from './api';
import TokenService from './token.service';

const AuthService = {

  // Inscription
  async register(data: { name: string; email: string; password: string; confirmPassword: string }) {
    const parts = data.name.trim().split(' ');
    const firstName = parts[0] || 'Utilisateur';
    const lastName  = parts.slice(1).join(' ') || 'Inconnu';
    const res = await api.post('/auth/register', {
      email: data.email,
      password: data.password,
      firstName,
      lastName,
    });
    return res.data;
  },

  // Connexion
  async login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    if (!data.requiresMfa) {
      TokenService.setToken(data.token);
      TokenService.setUser(data.user);
    }
    return {
      requiresMfa:  data.requiresMfa,
      mfaTempToken: data.userId,
      token:        data.token,
      user:         data.user,
    };
  },

  // Vérification MFA
  async verifyMfa(userId: string, otpCode: string) {
    const res = await api.post('/auth/mfa/verify', { userId, otpCode });
    const data = res.data;
    TokenService.setToken(data.token);
    TokenService.setUser(data.user);
    return data;
  },

  // Setup MFA
  async setupMfa() {
    const res = await api.post('/auth/mfa/setup');
    return res.data;
  },

  // Confirmer MFA
  async confirmMfa(otpCode: string) {
    const res = await api.post('/auth/mfa/confirm', { otpCode });
    return res.data;
  },

  // Déconnexion
  async logout() {
  try {
    await api.post('/auth/logout'); // Notifie le backend
  } catch {}
  TokenService.clear();
  window.location.href = '/auth/login';
  },

  // Utilisateur courant
  getCurrentUser() {
    return TokenService.getUser();
  },

  // Est connecté ?
  isAuthenticated(): boolean {
    return !!TokenService.getToken() && !TokenService.isTokenExpired();
  },

};

export { AuthService };
export default AuthService;

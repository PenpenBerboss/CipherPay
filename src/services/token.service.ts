// src/services/token.service.ts

const TOKEN_KEY = 'token';
const USER_KEY  = 'user';

const TokenService = {
  // Sauvegarder le token
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Supprimer le token
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Sauvegarder l'utilisateur
  setUser(user: object) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Récupérer l'utilisateur
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Tout effacer (déconnexion)
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Vérifier si le token est expiré
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

export default TokenService;

// src/hooks/useSession.ts
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import TokenService from '../services/token.service';

export const useSession = () => {
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const check = () => {
      if (TokenService.isTokenExpired()) {
        // Ne déconnecte que si l'utilisateur était connecté
        const token = TokenService.getToken();
        if (token) logout();
      }
    };

    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [logout]);
};

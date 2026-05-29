import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import TokenService from '../services/token.service';
import AuthService from '../services/auth.service';

export const useSession = () => {
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const token = TokenService.getToken();

      if (!token) return;

      if (TokenService.isTokenExpired()) {
        logout();
        return;
      }

      try {
        const user = await AuthService.getMe();
        if (isMounted) {
          setUser(user);
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          logout();
        }
      }
    };

    void syncSession();

    const interval = setInterval(() => {
      void syncSession();
    }, 30_000);

    const handleFocus = () => {
      void syncSession();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void syncSession();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logout, setUser]);
};

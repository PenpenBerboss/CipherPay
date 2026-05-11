import { useState, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export const useMFA = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { mfaTempToken, setAuth } = useAuthStore();

    const verifyMfa = useCallback(async (otp: string) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!mfaTempToken) throw new Error("Session MFA invalide");
            const { user, token } = await AuthService.verifyMfa(otp, mfaTempToken);
            setAuth(user, token);
            return true;
        } catch (err: any) {
            setError(err.message || "Code de vérification invalide.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [mfaTempToken, setAuth]);

    const setupMfa = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            return await AuthService.setupMfa();
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'initialisation MFA.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const enableMfa = useCallback(async (otp: string) => {
      setIsLoading(true);
      setError(null);
      try {
          return await AuthService.enableMfa(otp);
      } catch (err: any) {
          setError(err.message || "Échec de l'activation MFA");
          return false;
      } finally {
          setIsLoading(false);
      }
  }, []);

    return {
        verifyMfa,
        setupMfa,
        enableMfa,
        isLoading,
        error
    };
};

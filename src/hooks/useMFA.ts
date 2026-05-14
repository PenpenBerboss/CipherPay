import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import AuthService from '../services/auth.service';

export const useMFA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const pendingMfaUserId = useAuthStore((s) => s.pendingMfaUserId);
  const setAuth          = useAuthStore((s) => s.setAuth);

  // Setup MFA — génère le QR code
  const setupMfa = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AuthService.setupMfa();
      // Notre backend renvoie { secret, qrCode } (base64)
      // SetupMFA.tsx attend { secret, qrCodeUrl }
      return {
        secret:    data.secret,
        qrCodeUrl: data.qrCode, // base64 data URL
      };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du setup MFA.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmer/activer MFA
  const enableMfa = async (otpCode: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.confirmMfa(otpCode);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code OTP invalide.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Vérification MFA à la connexion
  const verifyMfa = async (otpCode: string): Promise<boolean> => {
    if (!pendingMfaUserId) {
      setError('Session MFA expirée. Reconnectez-vous.');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await AuthService.verifyMfa(pendingMfaUserId, otpCode);
      setAuth(data.user, data.token);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code OTP invalide.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { setupMfa, enableMfa, verifyMfa, isLoading, error };
};

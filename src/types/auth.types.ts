export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  balance?: number;
  totpEnabled?: boolean;
  securityScore: number;
  avatar?: string;
  role?: 'user' | 'admin';
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isMfaPending: boolean;
  mfaTempToken: string | null;
}

export interface LoginResponse {
  user?: User;
  token?: string;
  requiresMfa?: boolean;
  userId?: string;
}

export interface MfaSetupData {
  secret: string;
  qrCode: string;
}

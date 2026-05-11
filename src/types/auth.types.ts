export interface User {
  id: string;
  email: string;
  name: string;
  securityScore: number;
  mfaEnabled: boolean;
  avatar?: string;
  role: 'user' | 'admin';
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
  user: User;
  token: string;
  requiresMfa?: boolean;
  mfaTempToken?: string;
}

export interface MfaSetupData {
  secret: string;
  qrCodeUrl: string;
  recoveryCodes: string[];
}

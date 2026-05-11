export const AUTH_KEYS = {
  TOKEN: 'nc_auth_token',
  REFRESH_TOKEN: 'nc_refresh_token',
  USER: 'nc_usr_data',
};

export const SECURITY_RULES = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  MFA_CODE_LENGTH: 6,
  CODE_RESEND_TIMEOUT_SECONDS: 30,
};

// API Base configuration for axios
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
};

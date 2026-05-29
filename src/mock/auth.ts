import { User } from '../types/auth.types';

export const mockUsers: Record<string, User & { passwordHash: string; totpEnabled: boolean }> = {
  'test@node.net': {
    id: 'usr_01H8X',
    email: 'test@node.net',
    name: 'Cipher Operative',
    passwordHash: 'mocked_hash_123', // In reality, NEVER store clear text. Backend uses bcrypt.compare()
    securityScore: 85,
    totpEnabled: true,
    role: 'user',
    lastLogin: new Date().toISOString()
  },
  'admin@secure.net': {
    id: 'usr_02A9Y',
    email: 'admin@secure.net',
    name: 'Root Administrator',
    passwordHash: 'mocked_hash_admin',
    securityScore: 100,
    totpEnabled: false, // For testing MFA setup
    role: 'admin',
    lastLogin: new Date().toISOString()
  }
};

// Simulated JWT generator (Frontend should NEVER generate JWTs, this is strictly a mock)
export const generateMockJWT = (user: User) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + (60 * 60) }));
  const signature = 'mock_signature_do_not_trust';
  return `${header}.${payload}.${signature}`;
};

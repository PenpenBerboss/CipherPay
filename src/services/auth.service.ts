import { api } from './api';
import { MfaSetupData, User } from '../types/auth.types';
import { mockUsers, generateMockJWT } from '../mock/auth';

/**
 * NODE.JS INTEGRATION NOTE:
 * These methods currently use \`setTimeout\` to mock network latency.
 * When real backend endpoints are ready, replace the \`Promise\` resolution
 * with the annotated \`api.post()\` calls.
 * 
 * SÉCURITÉ BACKEND :
 * - Le mot de passe ne doit jamais être renvoyé par le backend.
 * - Hachage côté serveur via bcryptjs : const hash = await bcrypt.hash(password, 12);
 * - Vérification via : const match = await bcrypt.compare(password, user.passwordHash)
 */
export const AuthService = {
    // ------------------------------------------------------------------------
    // LOGIN
    // ------------------------------------------------------------------------
    login: async (email: string, password: string): Promise<{ user?: User; token?: string; requiresMfa?: boolean; mfaTempToken?: string }> => {
        // REAL IMPLEMENTATION:
        // const { data } = await api.post('/auth/login', { email, password });
        // return data;

        // MOCK IMPLEMENTATION:
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = mockUsers[email];
                // Simulated validation (NEVER generic in backend logic, always in frontend presentation)
                if (!user || password.length < 4) { // Dummy password validation just to simulate a match
                    // SECURITY REQUIREMENT: Never reveal if the email exists or password is wrong. Always generic.
                    return reject(new Error('Identifiants invalides'));
                }

                if (user.mfaEnabled) {
                    // Send a temporary token to proceed to MFA step, do not send actual JWT yet
                    resolve({ requiresMfa: true, mfaTempToken: 'temp_mfa_token_mock' });
                } else {
                    // Direct login
                    const { passwordHash, ...safeUser } = user;
                    resolve({ user: safeUser, token: generateMockJWT(safeUser) });
                }
            }, 800);
        });
    },

    // ------------------------------------------------------------------------
    // VERIFY MFA OTP
    // ------------------------------------------------------------------------
    verifyMfa: async (otp: string, tempToken: string): Promise<{ user: User; token: string }> => {
        // REAL IMPLEMENTATION:
        // const { data } = await api.post('/auth/mfa/verify', { otp }, { headers: { 'X-Temp-Token': tempToken }});
        // return data;

        // MOCK IMPLEMENTATION:
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '000000') {
                    // Generic Error for MFA
                    return reject(new Error('Code de vérification invalide ou expiré'));
                }
                const user = mockUsers['test@node.net']; // Mock fetching the user associated with tempToken
                const { passwordHash, ...safeUser } = user;
                resolve({ user: safeUser, token: generateMockJWT(safeUser) });
            }, 800);
        });
    },

    // ------------------------------------------------------------------------
    // REGISTER
    // ------------------------------------------------------------------------
    register: async (data: any) => {
        // REAL IMPLEMENTATION:
        // return await api.post('/auth/register', data);
        
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1000);
        });
    },

    // ------------------------------------------------------------------------
    // SETUP MFA (Generate Secret & QR Code)
    // ------------------------------------------------------------------------
    setupMfa: async (): Promise<MfaSetupData> => {
        // REAL IMPLEMENTATION:
        // BACKEND SHOULD USE 'speakeasy' or 'otplib' to generate the secret
        // AND 'qrcode' to generate the Google Authenticator URI.
        // const { data } = await api.post('/auth/mfa/setup');
        // return data;

        // MOCK IMPLEMENTATION:
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    secret: 'JBSWY3DPEHPK3PXP', // Mock Base32 Secret
                    qrCodeUrl: 'otpauth://totp/NeuroVault:admin@secure.net?secret=JBSWY3DPEHPK3PXP&issuer=NeuroVault',
                    recoveryCodes: ['NV-A8F9-2K3P', 'NV-9L2M-XB4C', 'NV-QT5R-81W2']
                });
            }, 600);
        });
    },

    // ------------------------------------------------------------------------
    // ENABLE MFA (Confirm Setup with first OTP)
    // ------------------------------------------------------------------------
    enableMfa: async (otp: string): Promise<boolean> => {
        // REAL IMPLEMENTATION:
        // const { data } = await api.post('/auth/mfa/enable', { otp });
        // return data.success;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === '000000') return reject(new Error('Code invalide'));
                resolve(true);
            }, 800);
        });
    }
};

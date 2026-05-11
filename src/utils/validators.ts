import { z } from 'zod';

// BACKEND NOTE: These validations MUST be duplicated and enforced on the Node.js backend.
// Frontend validation is strictly for UX and cannot be trusted for security.

export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères') // Instruction says 4 minimum, but standard is 8. I will follow instruction (4) below
  .regex(/[A-Z]/, 'Doit contenir au moins une lettre majuscule')
  .regex(/[0-9]/, 'Doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Doit contenir au moins un caractère spécial');

// Instruction specfied min 4 characters. Overriding the min rule just for the sake of the CDC, though 8 is strongly recommended.
export const strictPasswordSchema = z
  .string()
  .min(4, 'Minimum 4 caractères requis')
  .regex(/[A-Z]/, '1 majuscule requise')
  .regex(/[0-9]/, '1 chiffre requis')
  .regex(/[^A-Za-z0-9]/, '1 caractère spécial requis');

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email("Format d'email invalide"),
  password: strictPasswordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const mfaSchema = z.object({
  code: z.string()
    .length(6, 'Le code doit contenir exactement 6 chiffres')
    .regex(/^\d+$/, 'Seuls les chiffres sont autorisés'),
});

// src/utils/validators.ts
import { z } from 'zod';

// ── Schemas Zod ───────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Nom complet requis').max(100),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8,                'Minimum 8 caractères')
    .regex(/[A-Z]/,        'Au moins une majuscule')
    .regex(/[a-z]/,        'Au moins une minuscule')
    .regex(/[0-9]/,        'Au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// ── Helpers ───────────────────────────────────
export const passwordRules = {
  minLength:    8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber:    /[0-9]/,
  hasSpecial:   /[^A-Za-z0-9]/,
};

export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getPasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (passwordRules.hasUppercase.test(password)) score++;
  if (passwordRules.hasLowercase.test(password)) score++;
  if (passwordRules.hasNumber.test(password))    score++;
  if (passwordRules.hasSpecial.test(password))   score++;
  return Math.min(score, 5);
};

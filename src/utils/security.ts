// src/utils/security.ts
import DOMPurify from 'dompurify';

// Sanitise contre XSS
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

// Masque numéro de carte — affiche seulement les 4 derniers chiffres
export const maskCardNumber = (cardNumber: string): string => {
  return '**** **** **** ' + cardNumber.slice(-4);
};

// Masque le solde
export const maskBalance = (): string => {
  return '****.**';
};

// Masque l'email — ex: cl***@gmail.com
export const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  return user.slice(0, 2) + '***@' + domain;
};

// Masque l'IBAN
export const maskIban = (iban: string): string => {
  return iban.slice(0, 4) + ' **** **** ' + iban.slice(-4);
};

// Vérifie si une URL est sûre
export const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Valide un montant de transaction
export const validateAmount = (amount: number): boolean => {
  return amount >= 0.01 && amount <= 9999.99;
};

// src/utils/sanitize.ts
import DOMPurify from 'dompurify';

// Nettoie une chaîne HTML
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS:  [],  // Aucune balise HTML autorisée
    ALLOWED_ATTR:  [],
  });
};

// Nettoie un objet entier récursivement
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const clean = {} as T;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      clean[key] = sanitizeHtml(obj[key]) as any;
    } else {
      clean[key] = obj[key];
    }
  }
  return clean;
};

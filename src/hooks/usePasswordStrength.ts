import { useMemo } from 'react';
import { getPasswordStrength } from '../utils/validators';

export const usePasswordStrength = (password: string | undefined) => {
  const strength = useMemo(() => getPasswordStrength(password || ''), [password]);

  const label = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort', 'Excellent'][strength];
  const color  = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-emerald-500',
  ][strength];

  return { strength, label, color, max: 6 };
};

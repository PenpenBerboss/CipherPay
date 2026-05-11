import { useState, useEffect } from 'react';

export type StrengthLabel = 'weak' | 'medium' | 'strong';

interface PasswordCriteria {
  hasLength: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export const usePasswordStrength = (password: string) => {
  const [strength, setStrength] = useState<StrengthLabel>('weak');
  const [score, setScore] = useState(0);
  
  const [criteria, setCriteria] = useState<PasswordCriteria>({
    hasLength: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    // Note: The instruction asked for minimum 4 characters for testing
    const validations = {
      hasLength: password.length >= 4,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    setCriteria(validations);

    let currentScore = 0;
    if (validations.hasLength) currentScore += 1;
    if (validations.hasUpper) currentScore += 1;
    if (validations.hasNumber) currentScore += 1;
    if (validations.hasSpecial) currentScore += 1;

    setScore(currentScore);

    if (currentScore < 2) setStrength('weak');
    else if (currentScore < 4) setStrength('medium');
    else setStrength('strong');

  }, [password]);

  return { strength, score, criteria };
};

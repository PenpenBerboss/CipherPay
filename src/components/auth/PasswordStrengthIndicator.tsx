// src/components/auth/PasswordStrengthIndicator.tsx
import { usePasswordStrength } from '../../hooks/usePasswordStrength';

interface Props {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: Props) => {
  const { strength, label, color, max } = usePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? color : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
};

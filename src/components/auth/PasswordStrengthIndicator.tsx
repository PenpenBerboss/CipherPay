import { Check, X } from 'lucide-react';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export const PasswordStrengthIndicator = ({ password = '' }: PasswordStrengthIndicatorProps) => {
  const { strength, score, criteria } = usePasswordStrength(password);

  const getColor = () => {
    if (password.length === 0) return 'bg-muted';
    if (strength === 'weak') return 'bg-destructive';
    if (strength === 'medium') return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getLabel = () => {
    if (password.length === 0) return '';
    if (strength === 'weak') return 'Faible';
    if (strength === 'medium') return 'Moyen';
    return 'Fort';
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">Niveau de sécurité :</span>
        <span className="font-semibold px-2 py-0.5 rounded-full bg-background border border-border" style={{ color: strength === 'weak' ? '#ef4444' : strength === 'medium' ? '#eab308' : '#10b981' }}>
          {getLabel()}
        </span>
      </div>
      
      <div className="flex space-x-1 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`flex-1 rounded-full transition-colors duration-300 ${
              password.length > 0 && level <= score ? getColor() : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-2">
        <CriteriaItem met={criteria.hasLength} text="Minimum 4 caractères" />
        <CriteriaItem met={criteria.hasUpper} text="Une majuscule" />
        <CriteriaItem met={criteria.hasNumber} text="Un chiffre" />
        <CriteriaItem met={criteria.hasSpecial} text="Caractère spécial" />
      </div>
    </div>
  );
};

const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center space-x-1.5">
    {met ? (
      <Check className="w-3.5 h-3.5 text-emerald-500" />
    ) : (
      <X className="w-3.5 h-3.5 text-muted-foreground/50" />
    )}
    <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
      {text}
    </span>
  </div>
);

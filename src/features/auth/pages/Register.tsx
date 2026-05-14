import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Network, AlertCircle, EyeOff, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { registerSchema } from '../../../utils/validators';
import { PasswordStrengthIndicator } from '../../../components/auth/PasswordStrengthIndicator';
import { AuthService } from '../../../services/auth.service';
import { sanitizeInput } from '../../../utils/security'; // Ajout de la protection XSS

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Nettoyage des entrées contre les attaques XSS avant l'envoi au serveur
      const sanitizedData = {
        ...data,
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
      };

      await AuthService.register(sanitizedData);
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 rounded-2xl w-full"
    >
      <div className="flex items-center space-x-2 text-primary mb-6">
        <Network className="w-5 h-5" />
        <h2 className="text-lg font-semibold text-foreground">Initialiser le Nœud</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start space-x-2 text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="space-y-2">
          <Label htmlFor="name">Identité Légale</Label>
          <Input
            id="name"
            placeholder="Kamga prosper"
            className="bg-background/50 h-11"
            autoComplete="off"
            {...register('name')}
          />
          {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Alias Sécurisé (Email)</Label>
          <Input
            id="email"
            type="email"
            placeholder="alias@cipherpay.net"
            className="bg-background/50 h-11"
            autoComplete="off"
            {...register('email')}
          />
          {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="password">Phrase secrète</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="bg-background/50 h-11 pr-10"
              autoComplete="new-password"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
          <PasswordStrengthIndicator password={passwordValue} />
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="confirmPassword">Confirmer la phrase secrète</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="bg-background/50 h-11 pr-10"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <span className="text-xs text-destructive">{errors.confirmPassword.message}</span>}
        </div>

        <Button type="submit" className="w-full h-11 mt-4" disabled={isLoading}>
          {isLoading ? 'Génération...' : 'Générer les Clés'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Clés établies ? <button onClick={() => navigate('/auth/login')} className="text-primary hover:underline font-medium">S'authentifier</button>
      </div>
    </motion.div>
  );
}

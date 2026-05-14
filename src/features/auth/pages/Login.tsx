import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginSchema } from '../../../utils/validators';
import { AuthService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/auth.store';
import { LockedAccountState } from '../../../components/auth/LockedAccountState';
import { SECURITY_RULES } from '../../../utils/constants';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [genericError, setGenericError] = useState<string | null>(null);
  
  // Anti-Brute Force Local Mock States
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const setAuth = useAuthStore(state => state.setAuth);
  const setPendingMfa = useAuthStore(state => state.setPendingMfa);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Check if locked
    if (lockedUntil && Date.now() < lockedUntil) return;

    setIsLoading(true);
    setGenericError(null);

    try {
      const response = await AuthService.login(data.email, data.password);
      
      if (response.requiresMfa && response.mfaTempToken) {
        setPendingMfa(response.mfaTempToken);
        navigate('/verify-otp');
      } else if (response.user && response.token) {
        setAuth(response.user, response.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const currentAttempts = attempts + 1;
      setAttempts(currentAttempts);
      
      if (currentAttempts >= SECURITY_RULES.MAX_LOGIN_ATTEMPTS) {
        // Lock for 15 minutes
        setLockedUntil(Date.now() + SECURITY_RULES.LOCKOUT_DURATION_MINUTES * 60 * 1000);
      } else {
        // Must ALWAYS be a generic error indicating the combination is wrong
        // Must NEVER let the user know if the email specifically is registered or not
        setGenericError("Les identifiants fournis ne correspondent à aucun compte actif.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (lockedUntil && Date.now() < lockedUntil) {
    return <LockedAccountState unlockAt={lockedUntil} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-8 rounded-2xl w-full"
    >
      <div className="flex items-center space-x-2 text-primary mb-6">
        <KeyRound className="w-5 h-5" />
        <h2 className="text-lg font-semibold text-foreground">Connexion Sécurisée</h2>
      </div>

      {genericError && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start space-x-2 text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{genericError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
        <div className="space-y-2">
          <Label htmlFor="email">Identifiant (Email)</Label>
          <Input 
            id="email" 
            type="email" 
	    autoComplete="off"
            placeholder="alias@noeud.net" 
            className="bg-background/50 h-11"
            {...register('email')}
          />
          {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
        </div>
        
        <div className="space-y-2 relative">
          <div className="flex justify-between">
            <Label htmlFor="password">Phrase secrète</Label>
            <a href="#" className="text-xs text-primary hover:underline">Récupérer la clé</a>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••"
	      autoComplete="new-password" 
              className="bg-background/50 h-11 pr-10"
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
        </div>

        <Button type="submit" className="w-full h-11 mt-4" disabled={isLoading}>
          {isLoading ? 'Établissement du tunnel...' : "S'authentifier"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Aucun portefeuille initialisé ? <button onClick={() => navigate('/register')} className="text-primary hover:underline font-medium">Générer un Nœud</button>
      </div>
    </motion.div>
  );
}

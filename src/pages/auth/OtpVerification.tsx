import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { OtpInput } from '../../components/auth/OtpInput';
import { useMFA } from '../../hooks/useMFA';
import { SECURITY_RULES } from '../../utils/constants';

export default function OtpVerification() {
  const navigate = useNavigate();
  const { verifyMfa, isLoading, error } = useMFA();
  const [otp, setOtp] = useState('');
  
  // Timer for Resend
  const [timeLeft, setTimeLeft] = useState(SECURITY_RULES.CODE_RESEND_TIMEOUT_SECONDS);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  const handleComplete = async (code = otp) => {
    if (code.length === 6) {
      const success = await verifyMfa(code);
      if (success) {
        navigate('/dashboard');
      } else {
        setOtp('');
      }
    }
  };

  const handleResend = () => {
    setTimeLeft(SECURITY_RULES.CODE_RESEND_TIMEOUT_SECONDS);
    // Real implementation would trigger backend to resend code or show QR again if Speakeasy
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 rounded-2xl w-full text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-foreground mb-2">2FA Requis</h2>
      <p className="text-sm text-muted-foreground mb-8">Entrez le jeton cryptographique à 6 chiffres de votre application d'authentification.</p>
      
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex text-left items-start space-x-2 text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <OtpInput 
          length={6} 
          value={otp} 
          onChange={setOtp} 
          onComplete={() => handleComplete(otp)}
          disabled={isLoading}
        />
      </div>

      <Button 
        className="w-full h-11" 
        onClick={() => handleComplete()}
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? 'Vérification de la Signature...' : "Confirmer l'Authentification"}
      </Button>
      
      <div className="mt-6">
        <button 
          onClick={handleResend}
          disabled={timeLeft > 0}
          className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {timeLeft > 0 
            ? `Renvoyer le jeton (${timeLeft}s)` 
            : 'Renvoyer le jeton sécurisé'}
        </button>
      </div>
    </motion.div>
  );
}

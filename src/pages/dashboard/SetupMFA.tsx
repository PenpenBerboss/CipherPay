import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Copy, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useMFA } from '../../hooks/useMFA';
import { MfaSetupData } from '../../types/auth.types';
import { OtpInput } from '../../components/auth/OtpInput';

export default function SetupMFA() {
  const navigate = useNavigate();
  const { setupMfa, enableMfa, isLoading, error } = useMFA();
  
  const [setupData, setSetupData] = useState<MfaSetupData | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
  let cancelled = false;
  const initSetup = async () => {
    const data = await setupMfa();
    if (!cancelled && data) setSetupData(data);
  };
  initSetup();
  return () => { cancelled = true; };
}, []); // tableau vide = exécution unique

  const copySecret = () => {
    if (setupData) {
      navigator.clipboard.writeText(setupData.secret);
      // Could trigger a toast here
    }
  };

  const handleActivate = async () => {
    if (otp.length !== 6) return;
    setIsActivating(true);
    const success = await enableMfa(otp);
    setIsActivating(false);
    if (success) {
      setIsSuccess(true);
    } else {
      setOtp('');
    }
  };

  if (!setupData) {
    return (
      <div className="flex justify-center items-center h-64">
        {error ? <p className="text-destructive">{error}</p> : <Loader2 className="w-8 h-8 animate-spin text-primary" />}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto mt-12 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold">Protocol MFA Activé</h2>
        <p className="text-muted-foreground">
          Votre nœud est désormais protégé par une authentification à deux facteurs. Vous devrez fournir un jeton à chaque connexion.
        </p>
        <Button className="w-full" onClick={() => navigate('/dashboard/security')}>
          Retour à la Sécurité
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/dashboard/security')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Button>

      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Configurer le MFA</h2>
        
        {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-6">
                <p className="text-muted-foreground text-sm">
                    Scannez ce QR code avec Google Authenticator, Authy, ou toute application compatible TOTP.
                </p>

                <div className="bg-white p-4 rounded-xl inline-block mx-auto border-4 border-emerald-500/30">
                    {/* Placeholder for QR Code since we simulate its generation */}
                    <img 
                        src={setupData.qrCodeUrl} 
                        alt="QR Code" 
                        className="w-48 h-48"
                    />
                </div>

                <div className="bg-background/50 border border-border rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-2">Impossible de scanner ? Saisissez la clé manuellement :</p>
                    <div className="flex items-center justify-center space-x-2">
                        <code className="text-primary font-mono tracking-widest bg-primary/10 px-3 py-1 rounded">
                            {setupData.secret}
                        </code>
                        <Button variant="ghost" size="icon" onClick={copySecret} className="h-8 w-8 hover:bg-primary/20 hover:text-primary">
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <Button className="w-full" onClick={() => setStep(2)}>Suivant</Button>
            </motion.div>
        )}

        {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 mt-6">
                 <p className="text-muted-foreground text-sm">
                    Entrez le code à 6 chiffres généré par votre application pour finaliser le couplage.
                </p>

                {error && <p className="text-destructive text-sm font-medium">{error}</p>}

                <div className="py-4">
                    <OtpInput length={6} value={otp} onChange={setOtp} onComplete={() => handleActivate()} disabled={isActivating} />
                </div>

                <div className="flex space-x-3">
                    <Button variant="outline" className="w-1/3" onClick={() => setStep(1)} disabled={isActivating}>Précédent</Button>
                    <Button className="w-2/3" onClick={handleActivate} disabled={otp.length !== 6 || isActivating}>
                        {isActivating ? 'Vérification...' : 'Activer'}
                    </Button>
                </div>
            </motion.div>
        )}
      </div>
    </div>
  );
}

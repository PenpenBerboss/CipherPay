import { useEffect, useState } from 'react';
import { ShieldOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  unlockAt: number;
}

export const LockedAccountState = ({ unlockAt }: Props) => {
  const [remaining, setRemaining] = useState(
    Math.max(0, Math.ceil((unlockAt - Date.now()) / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const secs = Math.max(0, Math.ceil((unlockAt - Date.now()) / 1000));
      setRemaining(secs);
      if (secs === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [unlockAt]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 rounded-2xl w-full text-center"
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-destructive/10 rounded-full text-destructive">
          <ShieldOff className="w-8 h-8" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Compte Verrouillé</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Trop de tentatives échouées. Accès suspendu.
      </p>
      <div className="text-3xl font-mono font-bold text-destructive">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Temps restant avant déverrouillage</p>
    </motion.div>
  );
};

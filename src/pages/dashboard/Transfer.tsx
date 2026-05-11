import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { ArrowRight, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Transfer() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { addTransaction, wallet } = useAppStore();

  const handleNext = () => setStep(2);
  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      addTransaction({
        id: `tx_${Math.random().toString(36).substr(2, 9)}`,
        type: 'sent',
        amount: -parseFloat(amount),
        currency: 'USD',
        status: 'completed',
        date: new Date().toISOString(),
        recipient,
        hash: `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2] || '0').join('')}`,
        signature: `HMAC-SHA256:${Math.random().toString(36).substr(2, 20)}...`
      });
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Exécuter le Transfert</h2>
      
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -z-10" />
        {[1, 2, 3].map(i => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= i ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-muted text-muted-foreground'}`}>
            {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
          </div>
        ))}
      </div>

      <Card className="glass-panel border-border/50 overflow-hidden relative">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader>
              <CardTitle>Paramètres de la Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Adresse de Destination / Alias</Label>
                <Input 
                  placeholder="0x... or user@node.net" 
                  value={recipient} 
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-background/50 h-11 border-primary/20 focus-visible:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Montant (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-medium">$</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 bg-background/50 text-xl font-mono h-12 border-primary/20 focus-visible:ring-primary/50"
                  />
                  <span className="absolute right-3 top-3 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Max : ${wallet?.totalBalance.toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full h-11 mt-6 text-base" disabled={!recipient || !amount || parseFloat(amount) <= 0} onClick={handleNext}>
                Procéder à la Signature <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <CardHeader>
              <CardTitle>Confirmation Cryptographique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-start space-x-3">
                <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Exécution du Contrat Intelligent</p>
                  <p className="text-xs text-muted-foreground mt-1">Vous êtes sur le point de signer une transaction qui transférera irrévocablement des fonds sur le réseau de nœuds cryptographiques.</p>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-background/50 rounded-lg border border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destinataire</span>
                  <span className="font-medium text-foreground truncate max-w-[200px]">{recipient}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Montant du Transfert</span>
                  <span className="font-mono text-foreground">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frais de Réseau (Estimés)</span>
                  <span className="font-mono text-emerald-400">$0.00</span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between">
                  <span className="font-medium">Règlement Total</span>
                  <span className="font-bold text-lg text-primary">${parseFloat(amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="w-1/3" onClick={() => setStep(1)} disabled={isProcessing}>Annuler</Button>
                <Button className="w-2/3 shadow-[0_0_20px_rgba(6,182,212,0.3)]" onClick={handleConfirm} disabled={isProcessing}>
                  {isProcessing ? 'Génération de la Preuve...' : 'Signer et Diffuser'}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CardContent className="p-10 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Transfert Vérifié</h3>
              <p className="text-muted-foreground mb-8 max-w-sm">La preuve cryptographique a été ajoutée au registre. Le règlement est terminé.</p>
              
              <div className="w-full space-y-3">
                <Button className="w-full" onClick={() => navigate('/dashboard/transactions')}>Voir dans le Registre</Button>
                <Button variant="outline" className="w-full border-border/50" onClick={() => { setStep(1); setAmount(''); setRecipient(''); }}>Nouveau Transfert</Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </Card>
    </div>
  );
}

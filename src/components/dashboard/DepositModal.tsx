import React, { useEffect, useMemo, useState } from 'react';
import { X, Loader2, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';

export interface DepositModalProps {
  open: boolean;
  balance: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: { amount: number; description?: string }) => Promise<void> | void;
}

export default function DepositModal({
  open,
  balance,
  isSubmitting = false,
  onClose,
  onSubmit,
}: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setAmount('');
      setDescription('');
      setError(null);
    }
  }, [open]);

  const numericAmount = useMemo(() => Number(amount), [amount]);
  const isAmountValid = Number.isFinite(numericAmount) && numericAmount > 0;

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isAmountValid) {
      setError('Veuillez saisir un montant valide.');
      return;
    }

    if (numericAmount > 999999999999999) {
      setError('Le montant est trop élevé.');
      return;
    }

    try {
      await onSubmit({
        amount: numericAmount,
        description: description.trim() || undefined,
      });
    } catch (submitError: any) {
      setError(submitError?.message || 'Impossible de valider le dépôt.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deposit-dialog-title"
      onClick={onClose}
    >
      <Card
        className={cn(
          'w-full max-w-md border-2 border-black bg-card shadow-[12px_12px_0_0_rgba(0,0,0,1)]',
          'max-h-[90vh] overflow-auto'
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b-2 border-black/10 bg-background/50">
          <div className="space-y-1">
            <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Rechargement du compte
            </CardDescription>
            <CardTitle id="deposit-dialog-title" className="flex items-center gap-2 text-2xl">
              <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
              Dépôt
            </CardTitle>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="border-2 border-black bg-background shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-5 p-6">
          <div className="rounded-2xl border-2 border-black bg-emerald-500/10 p-4 shadow-[5px_5px_0_0_rgba(0,0,0,1)]">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Solde actuel</p>
            <p className="mt-2 text-2xl font-black text-foreground">{Number(balance || 0).toLocaleString()} FCFA</p>
          </div>

          {error && (
            <div className="rounded-xl border-2 border-destructive bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Montant à recharger</Label>
              <Input
                id="deposit-amount"
                type="number"
                min="1"
                step="1"
                placeholder="Ex. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-11 border-2 border-black bg-background/80 text-base shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit-description">Motif du dépôt</Label>
              <Input
                id="deposit-description"
                type="text"
                placeholder="Recharge manuelle, correction, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11 border-2 border-black bg-background/80 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="border-2 border-black bg-background shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>

              <Button
                type="submit"
                className="border-2 border-black bg-primary text-primary-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                disabled={isSubmitting || !isAmountValid}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Valider le dépôt
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

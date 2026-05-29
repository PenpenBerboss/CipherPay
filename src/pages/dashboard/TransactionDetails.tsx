import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle2, ShieldAlert, Cpu, Hash, Signature, Loader2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import TransactionService, { LedgerTransaction } from '@/services/transaction.service';

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<LedgerTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransaction = async () => {
      if (!id) {
        setError('Transaction introuvable.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await TransactionService.getById(id);
        setTransaction(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Impossible de charger le détail de la transaction.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadTransaction();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Chargement du détail...
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-bold text-foreground">Transaction introuvable</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          {error || 'La transaction demandée ne correspond à aucune entrée connue du registre.'}
        </p>
        <Button variant="link" className="mt-4" onClick={() => navigate('/dashboard/transactions')}>
          Retour au registre
        </Button>
      </div>
    );
  }

  const isReceived = transaction.direction === 'received';
  const counterparty = transaction.counterparty;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Button>

      <div className="flex items-center justify-between mb-2 gap-4">
        <h2 className="text-2xl font-bold tracking-tight break-all">Transaction {transaction.id}</h2>
        <Badge variant={transaction.status === 'completed' ? 'success' : 'secondary'} className="uppercase">
          {transaction.status}
        </Badge>
      </div>

      <Card className="glass-panel border-border/50">
        <CardContent className="p-0">
          <div className="p-6 md:p-8 bg-muted/10 border-b border-border flex flex-col items-center text-center">
            <p className="text-muted-foreground text-sm uppercase font-medium tracking-widest mb-2">
              {isReceived ? 'Montant Reçu' : 'Montant Envoyé'}
            </p>
            <h1 className={`text-5xl font-bold tracking-tighter mb-2 ${isReceived ? 'text-emerald-500' : 'text-foreground'}`}>
              {isReceived ? '+' : '-'}
              {transaction.amount.toLocaleString()} {transaction.currency}
            </h1>
            <p className="text-muted-foreground text-sm">{format(new Date(transaction.createdAt), "MMMM do, yyyy 'at' HH:mm:ss O")}</p>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-medium">Contrepartie</p>
                <p className="text-foreground font-medium">{counterparty.displayName}</p>
                <p className="text-xs text-muted-foreground">{counterparty.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-medium">Direction</p>
                <p className="text-foreground font-medium flex items-center">
                  {isReceived ? <ArrowDownLeft className="w-4 h-4 text-emerald-500 mr-2" /> : <ArrowUpRight className="w-4 h-4 text-destructive mr-2" />}
                  {isReceived ? 'Reçu' : 'Envoyé'}
                </p>
              </div>
            </div>

            <div className="space-y-6 border-t border-border pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
                <Hash className="w-4 h-4 mr-2" /> Intégrité cryptographique
              </h3>

              <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">SHA-256 Block Hash</p>
                  <p className="text-sm font-mono text-cyan-400 break-all">{transaction.hash}</p>
                </div>
                <div className="h-px bg-border w-full my-2" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <Signature className="w-3 h-3 mr-1" /> HMAC Signature
                  </p>
                  <p className="text-sm font-mono text-emerald-400 break-all">{transaction.signature}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Expéditeur</span>
                <span className="text-foreground font-medium">{transaction.sender.displayName}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Destinataire</span>
                <span className="text-foreground font-medium">{transaction.receiver.displayName}</span>
              </div>
              {transaction.description && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Description</span>
                  <span className="text-foreground font-medium text-right max-w-[60%]">{transaction.description}</span>
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center p-3 text-sm bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Transaction enregistrée dans le registre
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

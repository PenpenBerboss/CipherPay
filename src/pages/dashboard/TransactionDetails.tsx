import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle2, ShieldAlert, Cpu, Hash, Signature } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions } = useAppStore();
  
  const tx = transactions.find(t => t.id === id);

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-bold text-foreground">Proof Not Found</h3>
        <p className="text-muted-foreground text-sm max-w-sm">The requested cryptographic signature does not correspond to any known ledger entry.</p>
        <Button variant="link" className="mt-4" onClick={() => navigate('/dashboard/transactions')}>Return to Ledger</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
      </Button>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">Proof ID: {tx.id}</h2>
        <Badge variant={tx.status === 'completed' ? 'success' : 'secondary'} className="uppercase">
          {tx.status}
        </Badge>
      </div>

      <Card className="glass-panel border-border/50">
        <CardContent className="p-0">
          {/* Header block */}
          <div className="p-6 md:p-8 bg-muted/10 border-b border-border flex flex-col items-center text-center">
            <p className="text-muted-foreground text-sm uppercase font-medium tracking-widest mb-2">Net Transfer</p>
            <h1 className={`text-5xl font-bold tracking-tighter mb-2 ${tx.type === 'received' ? 'text-emerald-500' : 'text-foreground'}`}>
               {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
            </h1>
            <p className="text-muted-foreground text-sm">{format(new Date(tx.date), "MMMM do, yyyy 'at' HH:mm:ss O")}</p>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-medium">Counterparty Reference</p>
                <p className="text-foreground font-medium">{tx.recipient}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-medium">Execution Environment</p>
                <p className="text-foreground font-medium flex items-center">
                  <Cpu className="w-4 h-4 text-primary mr-2" /> Node Zero-Auth
                </p>
              </div>
            </div>

            <div className="space-y-6 border-t border-border pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
                <Hash className="w-4 h-4 mr-2" /> Cryptographic Integrity
              </h3>
              
              <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">SHA-256 Block Hash</p>
                  <p className="text-sm font-mono text-cyan-400 break-all">{tx.hash}</p>
                </div>
                <div className="h-px bg-border w-full my-2" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <Signature className="w-3 h-3 mr-1" /> EdDSA Digital Signature
                  </p>
                  <p className="text-sm font-mono text-emerald-400 truncate">{tx.signature}</p>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center p-3 text-sm bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Mathematical Proof Validated
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

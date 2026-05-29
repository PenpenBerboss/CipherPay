import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, Download, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import TransactionService, { LedgerTransaction } from '@/services/transaction.service';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TransactionService.list();
      setTransactions(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Impossible de charger l’historique des transactions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTransactions();
  }, []);

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return transactions;

    return transactions.filter((tx) => {
      const counterparty = tx.counterparty.displayName.toLowerCase();
      const sender = tx.sender.displayName.toLowerCase();
      const receiver = tx.receiver.displayName.toLowerCase();
      return (
        tx.hash.toLowerCase().includes(query) ||
        counterparty.includes(query) ||
        sender.includes(query) ||
        receiver.includes(query)
      );
    });
  }, [searchTerm, transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Historique du Registre</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={loadTransactions} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Actualiser
          </Button>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <Download className="w-4 h-4 mr-2" /> Exporter les Preuves Cryptographiques
          </Button>
        </div>
      </div>

      <Card className="glass-panel border-border/50 p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par hash, nom, email..."
              className="pl-9 bg-background/50 border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0 bg-background/50">
            <Filter className="w-4 h-4 mr-2" /> Filtres
          </Button>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Chargement de l’historique...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Hash Réseau</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Participant</th>
                    <th className="px-4 py-3 font-medium">Sens</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx, i) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={tx.id}
                      className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/transactions/${tx.id}`)}
                    >
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                        {tx.hash}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                        {format(new Date(tx.createdAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-4 py-4 font-medium text-foreground">
                        <div className="flex flex-col">
                          <span className="truncate">{tx.counterparty.displayName}</span>
                          <span className="text-xs text-muted-foreground truncate">{tx.counterparty.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${tx.direction === 'received' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                          {tx.direction === 'received' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {tx.direction === 'received' ? 'Reçu' : 'Envoyé'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={tx.status === 'completed' ? 'success' : 'secondary'} className="text-[10px]">
                          {tx.status}
                        </Badge>
                      </td>
                      <td className={`px-4 py-4 text-right font-semibold ${tx.direction === 'received' ? 'text-emerald-500' : 'text-foreground'}`}>
                        {tx.direction === 'received' ? '+' : '-'}
                        {tx.amount.toLocaleString()} {tx.currency}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune transaction ne correspond aux critères.
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { useAppStore } from '@/store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Transactions() {
  const { transactions } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filtered = transactions.filter(tx => 
    tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Historique du Registre</h2>
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
          <Download className="w-4 h-4 mr-2" /> Exporter les Preuves Cryptographiques
        </Button>
      </div>

      <Card className="glass-panel border-border/50 p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par hash, destinataire..." 
              className="pl-9 bg-background/50 border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="shrink-0 bg-background/50">
            <Filter className="w-4 h-4 mr-2" /> Filtres
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Hash Réseau</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Destinataire</th>
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
                    {format(new Date(tx.date), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-4 font-medium text-foreground">
                    <div className="flex items-center">
                      <div className={`p-1.5 rounded-full mr-3 shrink-0 ${tx.type === 'received' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                        {tx.type === 'received' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{tx.recipient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={tx.status === 'completed' ? 'success' : 'secondary'} className="text-[10px]">
                      {tx.status}
                    </Badge>
                  </td>
                  <td className={`px-4 py-4 text-right font-semibold ${tx.type === 'received' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Aucune preuve cryptographique ne correspond aux critères.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

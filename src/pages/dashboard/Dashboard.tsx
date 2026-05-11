import React from 'react';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, ArrowDownLeft, Eye, EyeOff, Send, Plus, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { wallet, transactions } = useAppStore();
  const [showBalance, setShowBalance] = React.useState(true);
  const navigate = useNavigate();

  const recentTxs = transactions.slice(0, 4);

  const mockChartData = [
    { date: 'Mon', value: 4000 },
    { date: 'Tue', value: 4500 },
    { date: 'Wed', value: 4200 },
    { date: 'Thu', value: 5800 },
    { date: 'Fri', value: 5100 },
    { date: 'Sat', value: 6900 },
    { date: 'Sun', value: 8200 },
  ];

  return (
    <div className="space-y-6">
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="glass-panel md:col-span-2 relative overflow-hidden border-primary/20">
          <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-muted-foreground font-medium uppercase tracking-wider">Solde total du registre</CardDescription>
            <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)} className="text-muted-foreground hover:text-foreground">
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-4xl sm:text-5xl font-bold tracking-tighter mb-6 text-foreground">
              {showBalance ? `$${wallet?.totalBalance.toLocaleString()}` : '••••••••'}
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => navigate('/dashboard/transfer')} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" /> Envoyer
              </Button>
              <Button variant="outline" className="border-border hover:bg-accent">
                <Plus className="w-4 h-4 mr-2" /> Dépôt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action/Status */}
        <Card className="glass-panel border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-emerald-500 flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" /> Nœuds synchronisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Volume de transactions sur 7 jours</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards & Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-semibold text-lg flex items-center"><span className="text-primary mr-2">|</span> Portefeuilles Actifs</h3>
          {wallet?.cards.map((card, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={card.id} 
              className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-xl relative overflow-hidden`}
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="flex justify-between items-start mb-8">
                <CreditCard className="w-8 h-8 opacity-80" />
                <span className="font-medium opacity-80">{card.type}</span>
              </div>
              <div className="text-2xl font-bold tracking-tight mb-2">${card.balance.toLocaleString()}</div>
              <div className="text-sm opacity-80">**** **** **** {card.last4}</div>
            </motion.div>
          ))}
        </div>

        <Card className="lg:col-span-2 glass-panel border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transferts Cryptographiques Récents</CardTitle>
            <Button variant="link" className="text-primary font-medium" onClick={() => navigate('/dashboard/transactions')}>Voir Tout</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTxs.map((tx, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={tx.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors border border-transparent hover:border-border cursor-pointer"
                  onClick={() => navigate(`/dashboard/transactions/${tx.id}`)}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${tx.type === 'received' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                      {tx.type === 'received' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{tx.recipient}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate w-24 sm:w-48">{tx.hash}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${tx.type === 'received' ? 'text-emerald-500' : 'text-foreground'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
                    </p>
                    <Badge variant={tx.status === 'completed' ? 'success' : 'secondary'} className="text-[10px] uppercase">
                      {tx.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Send,
  Plus,
  CreditCard,
  RefreshCw,
  Loader2,
  Wallet,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import TransactionService, { LedgerTransaction } from '@/services/transaction.service';
import DepositModal from '@/components/dashboard/DepositModal';

const mockChartData = [
  { date: 'Mon', value: 4000 },
  { date: 'Tue', value: 4500 },
  { date: 'Wed', value: 4200 },
  { date: 'Thu', value: 5800 },
  { date: 'Fri', value: 5100 },
  { date: 'Sat', value: 6900 },
  { date: 'Sun', value: 8200 },
];

const formatCounterpartyLabel = (tx: LedgerTransaction, fallbackName: string) => {
  if (tx.transactionKind === 'deposit') {
    return 'Dépôt crédité';
  }

  const participant = tx.counterparty.displayName || tx.counterparty.email || fallbackName;
  return tx.direction === 'received' ? `Reçu de ${participant}` : `Envoyé à ${participant}`;
};

export default function Dashboard() {
  const { user, updateBalance } = useAuthStore();
  const { addTransaction } = useAppStore();
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const navigate = useNavigate();

  const loadTransactions = async () => {
    setIsLoadingTransactions(true);
    setTransactionsError(null);

    try {
      const data = await TransactionService.list();
      setTransactions(data);
    } catch (err: any) {
      setTransactionsError(err?.response?.data?.message || 'Impossible de charger les transferts récents.');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    void loadTransactions();
  }, []);

  const recentTxs = useMemo(() => transactions.slice(0, 5), [transactions]);

  const walletBalance = Number(user?.balance ?? 0);
  const visibleBalance = showBalance ? `${walletBalance.toLocaleString()} FCFA` : '••••••••';

  const handleDeposit = async (payload: { amount: number; description?: string }) => {
    setIsDepositing(true);

    try {
      const response = await TransactionService.deposit(payload);
      updateBalance(response.balances.user);

      setTransactions((current) => [response.transaction, ...current]);
      addTransaction({
        id: response.transaction.id,
        type: 'received',
        amount: response.transaction.amount,
        currency: response.transaction.currency,
        status: response.transaction.status,
        date: response.transaction.createdAt,
        recipient: user?.email ?? 'wallet',
        hash: response.transaction.hash,
        signature: response.transaction.signature,
      });

      setIsDepositOpen(false);
      await loadTransactions();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Impossible de valider le dépôt.';
      throw new Error(message);
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="space-y-10">
      <DepositModal
        open={isDepositOpen}
        balance={walletBalance}
        isSubmitting={isDepositing}
        onClose={() => setIsDepositOpen(false)}
        onSubmit={handleDeposit}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 relative overflow-hidden border border-border bg-card/80 backdrop-blur-sm">
          <CardHeader className="relative flex flex-row items-start justify-between gap-4 border-b border-border/70 bg-transparent">
            <div className="space-y-2">
              <CardDescription className="text-xs font-black uppercase tracking-[0.24em] text-muted-foreground">
                Portefeuille utilisateur
              </CardDescription>
              <CardTitle className="text-2xl sm:text-4xl leading-tight">Vue du solde principal</CardTitle>
              <p className="max-w-xl text-sm text-muted-foreground">
                Suivi simplifié de votre compte, des dépôts récents et des transferts les plus sensibles.
              </p>
            </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance((value) => !value)}
                className="shrink-0 border border-border bg-background text-foreground hover:bg-accent"
                aria-label={showBalance ? 'Masquer le solde' : 'Afficher le solde'}
              >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </CardHeader>

          <CardContent className="relative space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-3xl border border-border bg-background/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Solde disponible</p>
                    <div className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                      {visibleBalance}
                    </div>
                  </div>

                  <div className="rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                    Compte actif
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate('/dashboard/transfer')}
                    className="border border-border bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4 mr-2" /> Envoyer
                  </Button>
                  <Button
                    onClick={() => setIsDepositOpen(true)}
                    variant="outline"
                    className="border border-border bg-background hover:bg-accent"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Dépôt
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={loadTransactions}
                    disabled={isLoadingTransactions}
                    className="border border-border bg-background hover:bg-accent"
                  >
                    {isLoadingTransactions ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Actualiser
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Identité</p>
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 font-bold text-foreground truncate">{user?.name || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}</p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <div className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sécurité</p>
                    <Activity className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="mt-2 font-bold text-foreground">{user?.totpEnabled ? 'MFA activé' : 'MFA désactivé'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Notifications de sécurité actives dans l’en-tête.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/70">
            <CardTitle className="text-sm uppercase tracking-[0.18em] text-emerald-500 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Indicateur réseau
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            <div className="h-32 w-full rounded-2xl border border-border bg-background/60 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '2px solid #000', borderRadius: '10px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground">Volume des mouvements sur 7 jours.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="text-primary">|</span> Portefeuille
          </h3>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 text-foreground backdrop-blur-sm"
          >

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Portefeuille principal</p>
                <p className="mt-2 text-3xl font-black tracking-tight">
                  {showBalance ? `${walletBalance.toLocaleString()} FCFA` : '••••••••'}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Carte virtuelle sécurisée liée au compte utilisateur.</p>
              </div>
              <CreditCard className="h-10 w-10 shrink-0 text-primary" />
            </div>

            <div className="relative mt-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Titulaire</p>
                <p className="font-semibold">{user?.name || 'Utilisateur'}</p>
              </div>
              <div className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]">
                {showBalance ? 'Visible' : 'Masqué'}
              </div>
            </div>
          </motion.div>
        </div>

        <Card className="xl:col-span-2 border border-border bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/70">
            <div>
              <CardTitle className="text-xl">Mouvements récents</CardTitle>
              <CardDescription>
                Dépôts, transferts et entrées récentes triés du plus récent au plus ancien.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="border border-border bg-background hover:bg-accent"
              onClick={loadTransactions}
              disabled={isLoadingTransactions}
            >
              {isLoadingTransactions ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Actualiser
            </Button>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {transactionsError ? (
              <div className="rounded-xl border-2 border-destructive bg-destructive/10 p-4 text-destructive">
                {transactionsError}
              </div>
            ) : isLoadingTransactions ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Chargement des transferts...
              </div>
            ) : (
              <div className="space-y-4">
                {recentTxs.map((tx, i) => {
                  const isReceived = tx.direction === 'received';
                  const participant = tx.counterparty.displayName || tx.counterparty.email;
                  const title = formatCounterpartyLabel(tx, participant);

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      key={tx.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/70 p-4 transition-colors hover:bg-accent/40 cursor-pointer"
                      onClick={() => navigate(`/dashboard/transactions/${tx.id}`)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full border border-border ${
                            tx.transactionKind === 'deposit'
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : isReceived
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {tx.transactionKind === 'deposit' ? (
                            <Wallet className="w-5 h-5" />
                          ) : isReceived ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{title}</p>
                          <p className="text-xs text-muted-foreground font-mono truncate max-w-[16rem]">
                            {tx.hash}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`font-black text-sm ${tx.transactionKind === 'deposit' ? 'text-emerald-500' : isReceived ? 'text-emerald-500' : 'text-foreground'}`}>
                          {tx.transactionKind === 'deposit' || isReceived ? '+' : '-'}
                          {tx.amount.toLocaleString()} {tx.currency}
                        </p>
                        <Badge variant={tx.transactionKind === 'deposit' ? 'success' : tx.status === 'completed' ? 'success' : 'secondary'} className="mt-2 text-[10px] uppercase border border-border">
                          {tx.transactionKind === 'deposit' ? 'dépôt' : tx.status}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}

                {recentTxs.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border/40 bg-muted/20 p-10 text-center text-muted-foreground">
                    Aucune transaction disponible pour le moment.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

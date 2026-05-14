import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Activity, ShieldAlert, CheckCircle, Info, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import api from '@/services/api';

interface Log {
  id: number;
  action: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// Parse le user agent en nom lisible
const parseDevice = (ua: string): string => {
  if (!ua) return 'Appareil inconnu';
  if (ua.includes('Firefox'))  {
    const version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
    const os = ua.includes('Windows') ? 'Windows' : ua.includes('Linux') ? 'Linux' : ua.includes('Mac') ? 'macOS' : 'Unknown';
    return `Firefox ${version} - ${os}`;
  }
  if (ua.includes('Chrome')) {
    const version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
    const os = ua.includes('Windows') ? 'Windows' : ua.includes('Linux') ? 'Linux' : ua.includes('Mac') ? 'macOS' : 'Unknown';
    return `Chrome ${version} - ${os}`;
  }
  if (ua.includes('Safari')) return 'Safari - macOS';
  return 'Navigateur inconnu';
};

// Nettoie l'IP
const parseIp = (ip: string): string => {
  if (!ip) return 'N/A';
  return ip.replace('::ffff:', ''); // Convertit ::ffff:127.0.0.1 → 127.0.0.1
};

// Détermine le statut selon l'action
const getStatus = (action: string): 'success' | 'warning' | 'info' => {
  if (['LOGIN_SUCCESS', 'MFA_SUCCESS', 'REGISTER', 'MFA_ENABLED'].includes(action))
    return 'success';
  if (['LOGIN_FAILED', 'MFA_FAILED'].includes(action))
    return 'warning';
  return 'info';
};

// Traduit l'action en français
const translateAction = (action: string): string => {
  const map: Record<string, string> = {
    LOGIN_SUCCESS: 'Connexion réussie',
    LOGIN_FAILED:  'Tentative de connexion échouée',
    MFA_SUCCESS:   'Vérification OTP réussie',
    MFA_FAILED:    'Code OTP invalide',
    MFA_ENABLED:   'MFA activé',
    REGISTER:      'Inscription',
    LOGOUT:        'Déconnexion',
  };
  return map[action] || action;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'warning': return <ShieldAlert className="w-4 h-4 text-destructive" />;
    default:        return <Info className="w-4 h-4 text-primary" />;
  }
};

export default function Logs() {
  const [logs, setLogs]       = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/logs');
        setLogs(res.data.logs);
      } catch (err: any) {
        setError('Impossible de charger les logs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Journal d'Événements Système</h2>
      </div>

      <Card className="glass-panel border-border/50">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-destructive text-center p-8">{error}</p>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground text-center p-8">Aucun événement enregistré.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase border-b border-border bg-muted/20">
                <tr>
                  <th className="px-6 py-4 font-medium">Horodatage</th>
                  <th className="px-6 py-4 font-medium">Événement</th>
                  <th className="px-6 py-4 font-medium">Appareil</th>
                  <th className="px-6 py-4 font-medium text-right">Adresse IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const status = getStatus(log.action);
                  return (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-accent/20">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className={status === 'warning' ? 'text-destructive font-medium' : ''}>
                          {translateAction(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {parseDevice(log.user_agent)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-right text-muted-foreground">
                        {parseIp(log.ip_address)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

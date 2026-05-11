import React from 'react';
import { useAppStore } from '@/store';
import { format } from 'date-fns';
import { Activity, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function Logs() {
  const { logs } = useAppStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <ShieldAlert className="w-4 h-4 text-destructive" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Journal d'Événements Système</h2>
      </div>

      <Card className="glass-panel border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border bg-muted/20">
              <tr>
                <th className="px-6 py-4 font-medium">Horodatage</th>
                <th className="px-6 py-4 font-medium">Vecteur d'Événement</th>
                <th className="px-6 py-4 font-medium">Profil de l'Appareil</th>
                <th className="px-6 py-4 font-medium text-right">Adresse IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-accent/20">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                  </td>
                  <td className="px-6 py-4 text-foreground flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span className={log.status === 'warning' ? 'text-destructive font-medium' : ''}>{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {log.device}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-right text-muted-foreground">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

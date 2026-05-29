import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Fingerprint, KeySquare, Smartphone } from 'lucide-react';

export default function Security() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Matrice de Sécurité</h2>
        <p className="text-muted-foreground">Gérez vos clés cryptographiques et contrôles d'accès.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-emerald-500/30 md:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle>Immunité du Système</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative mb-4">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse" />
              <span className="text-3xl font-bold text-emerald-500">{user?.securityScore || 50}</span>
            </div>
            <h3 className="font-medium text-lg text-emerald-500">État Optimal</h3>
            <p className="text-xs text-muted-foreground mt-2">Votre nœud est totalement résistant aux vecteurs connus.</p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <Card className="bg-card/40 border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${user?.totpEnabled ? 'bg-primary/10 text-primary' : 'border border-border text-muted-foreground'}`}>
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Authentification Multifacteur (AMF)</p>
                  <p className="text-xs text-muted-foreground">Nécessite une seconde preuve lors de la connexion au nœud.</p>
                </div>
              </div>
              {user?.totpEnabled ? (
                <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10">Actif</Button>
              ) : (
                <Button variant="default" onClick={() => navigate('/dashboard/security/setup-mfa')}>Configurer</Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 border border-border rounded-full text-muted-foreground">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Enclave Biométrique</p>
                  <p className="text-xs text-muted-foreground">Liez les signatures matérielles locales à vos clés.</p>
                </div>
              </div>
              <Button variant="outline" disabled>Configurer</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-card/40 border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 border border-border rounded-full text-muted-foreground">
                  <KeySquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Rotation de la Clé Maître</p>
                  <p className="text-xs text-muted-foreground">Générer une nouvelle phrase secrète cryptographique.</p>
                </div>
              </div>
              <Button variant="secondary" disabled>Initier</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

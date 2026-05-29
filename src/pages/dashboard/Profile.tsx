import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Loader2, Shield, CheckCircle2 } from 'lucide-react';
import AuthService from '@/services/auth.service';

export default function Profile() {
  const { user, setUser, updateProfile } = useAuthStore();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const profile = await AuthService.getMe();
        setUser(profile);
        setEmail(profile.email);
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Impossible de charger le profil.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }

    void loadProfile();
  }, [setUser]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await AuthService.updateMe({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      updateProfile({
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
      });

      setUser({
        ...updated,
        role: updated.role,
      });

      setMessage('Profil mis à jour avec succès.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Impossible de mettre à jour le profil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Chargement du profil...
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="glass-panel border-border/50 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center text-muted-foreground">
          Profil indisponible.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profil utilisateur</h2>
        <p className="text-muted-foreground">Gérez vos informations personnelles et votre identité de compte.</p>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <Card className="glass-panel border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="relative">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-primary/20 object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {(user.name || `${user.firstName} ${user.lastName}`).charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-foreground">{user.name || `${user.firstName} ${user.lastName}`}</h3>
              <p className="text-primary font-mono text-sm mt-1 break-all">{user.id}</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                  Solde: {Number(user.balance || 0).toLocaleString()} XOF
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {user.totpEnabled ? 'MFA activé' : 'MFA désactivé'}
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-4 pt-6 border-t border-border" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-background/50" />
              </div>

              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-background/50" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background/50" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

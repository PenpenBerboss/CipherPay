import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Loader2, Search, RefreshCw, Trash2, UserCog, Shield, ShieldOff } from 'lucide-react';
import AuthService from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  totpEnabled: boolean;
  role: 'user' | 'admin';
  isLocked?: boolean;
};

const emptyForm = {
  email: '',
  firstName: '',
  lastName: '',
  balance: '0',
  role: 'user' as 'user' | 'admin',
  totpEnabled: false,
  isLocked: false,
};

export default function AdminUsers() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.listUsers({ search, limit: 100, offset: 0 });
      setUsers(response.users || []);
      if (!selectedUser && response.users?.length) {
        setSelectedUser(response.users[0]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    setForm({
      email: selectedUser.email,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      balance: String(selectedUser.balance ?? 0),
      role: selectedUser.role,
      totpEnabled: selectedUser.totpEnabled,
      isLocked: Boolean(selectedUser.isLocked),
    });
  }, [selectedUser]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return users;

    return users.filter((item) => {
      return (
        item.email.toLowerCase().includes(query) ||
        item.firstName.toLowerCase().includes(query) ||
        item.lastName.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query)
      );
    });
  }, [search, users]);

  const handleSave = async () => {
    if (!selectedUser) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await AuthService.updateUser(selectedUser.id, {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        balance: Number(form.balance),
        role: form.role,
        totpEnabled: form.totpEnabled,
        isLocked: form.isLocked,
      });

      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedUser(updated);
      setMessage('Utilisateur mis à jour avec succès.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Impossible de mettre à jour cet utilisateur.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Supprimer définitivement cet utilisateur ?');
    if (!confirmed) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await AuthService.deleteUser(id);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      setSelectedUser((current) => {
        if (current?.id !== id) return current;
        return users.find((item) => item.id !== id) || null;
      });
      setMessage('Utilisateur supprimé avec succès.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Impossible de supprimer cet utilisateur.');
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Card className="glass-panel border-border/50 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <ShieldOff className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Accès administrateur requis</h2>
          <p className="text-muted-foreground">
            Cette interface est réservée aux administrateurs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserCog className="w-6 h-6 text-primary" />
            Administration des utilisateurs
          </h2>
          <p className="text-muted-foreground">Gestion des comptes, rôles et permissions.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => void loadUsers()} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Actualiser
          </Button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-500">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="glass-panel border-border/50 xl:col-span-1">
          <CardHeader>
            <CardTitle>Répertoire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un utilisateur"
                className="pl-9 bg-background/50"
              />
            </div>

            <div className="space-y-2 max-h-[620px] overflow-auto pr-1">
              {filteredUsers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedUser(item)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                    selectedUser?.id === item.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-accent/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {item.firstName} {item.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{item.email}</p>
                    </div>
                    <Badge variant={item.role === 'admin' ? 'success' : 'secondary'}>
                      {item.role}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{Number(item.balance || 0).toLocaleString()} XOF</span>
                    <span>{item.totpEnabled ? 'MFA' : 'Sans MFA'}</span>
                  </div>
                </button>
              ))}

              {!loading && filteredUsers.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Aucun utilisateur trouvé.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50 xl:col-span-2">
          <CardHeader>
            <CardTitle>Détails et édition</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedUser ? (
              <div className="text-center text-muted-foreground py-20">
                Sélectionnez un utilisateur pour modifier son profil.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={form.role === 'admin' ? 'success' : 'secondary'}>
                    {form.role}
                  </Badge>
                  {form.totpEnabled ? (
                    <Badge variant="success">MFA activé</Badge>
                  ) : (
                    <Badge variant="secondary">MFA désactivé</Badge>
                  )}
                  {form.isLocked ? (
                    <Badge variant="destructive">Compte verrouillé</Badge>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rôle</Label>
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          role: e.target.value as 'user' | 'admin',
                        }))
                      }
                      className="h-9 w-full rounded-md border border-input bg-background/50 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Solde</Label>
                    <Input
                      type="number"
                      value={form.balance}
                      onChange={(e) => setForm((prev) => ({ ...prev, balance: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contrôle d’accès</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={form.totpEnabled ? 'secondary' : 'outline'}
                        className="flex-1"
                        onClick={() => setForm((prev) => ({ ...prev, totpEnabled: !prev.totpEnabled }))}
                      >
                        {form.totpEnabled ? 'Désactiver MFA' : 'Activer MFA'}
                      </Button>
                      <Button
                        type="button"
                        variant={form.isLocked ? 'destructive' : 'outline'}
                        className="flex-1"
                        onClick={() => setForm((prev) => ({ ...prev, isLocked: !prev.isLocked }))}
                      >
                        {form.isLocked ? 'Déverrouiller' : 'Verrouiller'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleSave} disabled={saving} className="sm:w-auto">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Enregistrer
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleDelete(selectedUser.id)}
                    disabled={saving}
                    className="sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

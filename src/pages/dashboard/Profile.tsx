import React from 'react';
import { useAuthStore } from '../../store/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Identity Node</h2>

      <Card className="glass-panel border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="relative">
              <img src={user?.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-primary/20 object-cover" />
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-foreground">{user?.name}</h3>
              <p className="text-primary font-mono text-sm mt-1">{user?.id}</p>
              <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                <Button variant="outline" size="sm">Update Photo</Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">Purge Node Data</Button>
              </div>
            </div>
          </div>

          <form className="space-y-4 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Legal Alias</Label>
                <Input defaultValue={user?.name} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label>Encrypted Routing ID (Email)</Label>
                <Input defaultValue={user?.email} className="bg-background/50" readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Primary Fiat Currency</Label>
                <Input defaultValue="USD - United States Dollar" className="bg-background/50 text-muted-foreground" readOnly />
              </div>
            </div>
            <Button className="mt-4" type="button">Commit Changes to Ledger</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

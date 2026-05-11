import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>
      
      <div className="z-10 w-full max-w-sm">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-12 w-12 bg-primary/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-primary/30 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center text-foreground">Portefeuille CipherPay</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">Système de transaction cryptographique V2</p>
        </div>
        
        <Outlet />
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Protégé par un chiffrement de bout en bout.</p>
        </div>
      </div>
    </div>
  );
}

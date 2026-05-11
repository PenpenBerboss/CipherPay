import React from 'react';
import { motion } from 'motion/react';
import { Shield, Fingerprint, Lock, ChevronRight, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-8 z-10 border-b border-border/50 bg-background/50 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl tracking-tighter">CipherPay</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#security" className="hover:text-foreground transition-colors">Sécurité</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>
        <div className="flex space-x-4">
          <Button variant="ghost" onClick={() => navigate('/auth/login')}>Connexion</Button>
          <Button onClick={() => navigate('/auth/login')}>Créer un compte</Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center space-x-2 bg-secondary/50 rounded-full px-3 py-1 mb-6 border border-border text-sm">
            <LockKeyhole className="w-4 h-4 text-emerald-400" />
            <span className="text-secondary-foreground text-xs md:text-sm">Système financier chiffré de bout en bout V2.1.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 py-2">
            Le standard cryptographique <br/> pour portefeuilles
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Transactions financières sécurisées, anonymes et basées sur des preuves mathématiques pour le web moderne. Protégez vos actifs avec un chiffrement de niveau militaire.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base group" onClick={() => navigate('/auth/login')}>
              Déployer le Portefeuille
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-primary/20 text-primary hover:bg-primary/10">
              Auditer le Protocole
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl text-left" id="features">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl">
            <Fingerprint className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Preuves à divulgation nulle</h3>
            <p className="text-sm text-muted-foreground">Authentifiez-vous et effectuez des transactions sans exposer vos données d'identité fondamentales au réseau.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-2xl">
            <Shield className="w-10 h-10 text-cyan-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Registre Immuable</h3>
            <p className="text-sm text-muted-foreground">Chaque transaction est hachée avec SHA-256 et signée, garantissant une intégrité historique absolue.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6 rounded-2xl">
            <Lock className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Contexte MFA Dynamique</h3>
            <p className="text-sm text-muted-foreground">L'authentification multifacteur s'adapte aux menaces et se déclenche instantanément sur les anomalies heuristiques.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

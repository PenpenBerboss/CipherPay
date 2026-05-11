import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ArrowRightLeft, 
  Send, 
  Settings, 
  User, 
  LogOut, 
  Bell,
  Activity
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Tableau de Bord', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Transactions', icon: ArrowRightLeft, path: '/dashboard/transactions' },
    { name: 'Virement', icon: Send, path: '/dashboard/transfer' },
    { name: "Journal d'Activité", icon: Activity, path: '/dashboard/logs' },
    { name: 'Sécurité', icon: ShieldCheck, path: '/dashboard/security' },
    { name: 'Profil', icon: User, path: '/dashboard/profile' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <ShieldCheck className="w-6 h-6 text-primary mr-2" />
          <span className="font-bold tracking-tight text-lg">CipherPay</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                "end" in item ? "" : ""
              )}
              end={item.path === '/dashboard'}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border focus-within:ring-2 ring-primary">
          <div className="flex items-center mb-4">
            {user.avatar ? (
                <img src={user.avatar} className="w-10 h-10 rounded-full border border-primary/50" alt="Avatar" />
            ) : (
                <div className="w-10 h-10 rounded-full border border-primary/50 bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0)}
                </div>
            )}
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-emerald-400">Score: {user.securityScore}/100</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative z-10">
        <header className="h-16 border-b border-border bg-card/30 backdrop-blur-xl flex items-center justify-between px-8">
          <h1 className="text-lg font-medium text-foreground hidden sm:block">
            Environnement Sécurisé
          </h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 bg-destructive rounded-full absolute top-2 right-2 border border-background"></span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full max-w-6xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

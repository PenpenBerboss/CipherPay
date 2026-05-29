import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import {
  ShieldCheck,
  LayoutDashboard,
  ArrowRightLeft,
  Send,
  User,
  LogOut,
  Bell,
  Activity,
  Users,
  CheckCheck,
  ShieldAlert,
  BadgeInfo,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationService, { SecurityNotification } from '@/services/notification.service';

const getNotificationIcon = (type: SecurityNotification['type']) => {
  if (type === 'security') return <ShieldAlert className="h-4 w-4 text-amber-500" />;
  if (type === 'transaction') return <BadgeInfo className="h-4 w-4 text-primary" />;
  return <ShieldCheck className="h-4 w-4 text-muted-foreground" />;
};

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<SecurityNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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

  if (user?.role === 'admin') {
    navItems.splice(3, 0, { name: 'Administration', icon: Users, path: '/dashboard/admin/users' });
  }

  const loadNotifications = async () => {
    setIsLoadingNotifications(true);

    try {
      const data = await NotificationService.list(8);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const securityNotifications = useMemo(
    () => notifications.filter((notification) => notification.type === 'security'),
    [notifications]
  );

  const handleNotificationClick = async (notification: SecurityNotification) => {
    if (notification.isRead) {
      setNotificationsOpen(false);
      return;
    }

    try {
      const response = await NotificationService.markAsRead(notification.id);
      setUnreadCount(response.unreadCount);
      setNotifications((current) =>
        current.map((entry) =>
          entry.id === notification.id
            ? {
                ...entry,
                isRead: true,
              }
            : entry
        )
      );
    } finally {
      setNotificationsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await NotificationService.markAllAsRead();
      setUnreadCount(response.unreadCount);
      setNotifications((current) => current.map((entry) => ({ ...entry, isRead: true })));
    } finally {
      setNotificationsOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full bg-background relative overflow-hidden isolate">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <aside className="hidden md:flex w-72 border-r border-border bg-card/50 backdrop-blur-2xl flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <ShieldCheck className="w-6 h-6 text-primary mr-2" />
          <span className="font-black tracking-tight text-lg">CipherPay</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all group border border-transparent',
                  isActive
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-border'
                )
              }
              end={item.path === '/dashboard'}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center mb-4">
            {user.avatar ? (
              <img src={user.avatar} className="w-10 h-10 rounded-full border border-primary/50 object-cover" alt="Avatar" />
            ) : (
              <div className="w-10 h-10 rounded-full border border-primary/50 bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user.name?.charAt(0) || user.firstName?.charAt(0) || '?'}
              </div>
            )}
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-emerald-500">Score: {user.securityScore}/100</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-0">
        <header className="relative z-40 h-16 border-b border-border bg-card/60 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-foreground hidden sm:block truncate">
              Environnement Sécurisé
            </h1>
            <p className="hidden sm:block text-xs text-muted-foreground">Vue de synthèse du compte et des alertes</p>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative border border-border bg-background/80 shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                onClick={() => setNotificationsOpen((value) => !value)}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="w-2.5 h-2.5 bg-destructive rounded-full absolute top-2 right-2 border border-background" />
                )}
              </Button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-[min(92vw,24rem)] z-[70]"
                  >
                    <Card className="border-2 border-black bg-card shadow-[10px_10px_0_0_rgba(0,0,0,1)] overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b-2 border-black/10 bg-background/60 py-4">
                        <div>
                          <CardTitle className="text-base">Notifications</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est à jour'}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          disabled={unreadCount === 0}
                          className="border-2 border-black bg-background shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                        >
                          <CheckCheck className="mr-2 h-4 w-4" />
                          Tout lire
                        </Button>
                      </CardHeader>

                      <CardContent className="p-0 max-h-[26rem] overflow-auto">
                        {isLoadingNotifications ? (
                          <div className="flex items-center justify-center py-10 text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Chargement...
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-6 text-sm text-muted-foreground text-center">
                            Aucune notification pour le moment.
                          </div>
                        ) : (
                          <div className="divide-y divide-border">
                            {securityNotifications.map((notification) => (
                              <button
                                key={notification.id}
                                type="button"
                                className={cn(
                                  'w-full text-left px-4 py-4 hover:bg-accent/40 transition-colors',
                                  !notification.isRead && 'bg-emerald-500/5'
                                )}
                                onClick={() => void handleNotificationClick(notification)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black bg-background shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                                    {getNotificationIcon(notification.type)}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                      <p className="font-semibold text-sm text-foreground truncate">{notification.title}</p>
                                      {!notification.isRead && (
                                        <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                                          Nouveau
                                        </span>
                                      )}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
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

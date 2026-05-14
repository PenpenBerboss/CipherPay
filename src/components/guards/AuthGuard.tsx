// src/components/guards/AuthGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export const AuthGuard = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
};

export const GuestGuard = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

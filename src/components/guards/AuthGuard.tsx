import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export const AuthGuard = () => {
    const { isAuthenticated, isInitialized } = useAuthStore();
    const location = useLocation();

    if (!isInitialized) return null; // Or a high-level splash screen loader

    // If not authenticated, send to login but remember the attempted URL to redirect back
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export const GuestGuard = () => {
    const { isAuthenticated, isInitialized, isMfaPending } = useAuthStore();
    const location = useLocation();

    if (!isInitialized) return null;

    if (isMfaPending && location.pathname !== '/verify-otp') {
        return <Navigate to="/verify-otp" replace />;
    }

    if (isAuthenticated) {
        // Find the 'from' page in state, or default to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
};

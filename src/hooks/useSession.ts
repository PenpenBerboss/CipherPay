import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { TokenService } from '../services/token.service';
import { useNavigate } from 'react-router-dom';

/**
 * useSession Hook
 * 
 * BACKEND INTEGRATION NOTE:
 * In a real application, the backend issues short-lived Access Tokens (e.g., 15 mins)
 * and long-lived Refresh Tokens (e.g., 7 days) via HTTP-Only cookies.
 * 
 * The Axios interceptor automatically handles 401 token expiry.
 * This hook is used for frontend-driven idle timeout and initializing the store.
 */
export const useSession = () => {
    const { initialize, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    // Init store on app start
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Simple Idle Timeout Mock (1 hour of inactivity => auto logout)
    useEffect(() => {
        if (!isAuthenticated) return;

        let timeoutId: number;

        const resetTimer = () => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                logout();
                // Optionally show a modal here
                navigate('/login', { state: { sessionExpired: true } });
            }, 60 * 60 * 1000); // 1 hour
        };

        resetTimer();

        const events = ['mousemove', 'keydown', 'scroll', 'click'];
        events.forEach(e => window.addEventListener(e, resetTimer));

        return () => {
            window.clearTimeout(timeoutId);
            events.forEach(e => window.removeEventListener(e, resetTimer));
        };
    }, [isAuthenticated, logout, navigate]);
};

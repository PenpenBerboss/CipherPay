import DOMPurify from 'dompurify';
import axios from 'axios';

const api = axios.create({
  baseURL:         'https://localhost:5000/api',
  timeout:         10000,
  withCredentials: true,
  headers:         { 'Content-Type': 'application/json' },
});

let csrfToken: string | null = null;

const fetchCsrfToken = async () => {
  try {
    const res = await axios.get('https://localhost:5000/api/csrf-token', {
      withCredentials: true,
    });
    csrfToken = res.data.csrfToken;
  } catch (err) {
    console.error('Erreur récupération CSRF token:', err);
  }
};

fetchCsrfToken();

// ── Intercepteur requête : injecte JWT + CSRF ──
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (['post', 'put', 'delete', 'patch'].includes(config.method || '')) {
    if (!csrfToken) await fetchCsrfToken();
    if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// ── Sanitisation DOMPurify ─────────────────────
const sanitizeValue = (val: any): any => {
  if (typeof val === 'string') return DOMPurify.sanitize(val);
  if (typeof val === 'object' && val !== null) {
    Object.keys(val).forEach(k => { val[k] = sanitizeValue(val[k]); });
  }
  return val;
};

// ── Intercepteur réponse : sanitise + gère erreurs ──
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object') {
      response.data = sanitizeValue(response.data);
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 403 &&
        error.response?.data?.message?.includes('CSRF')) {
      await fetchCsrfToken();
      return api.request(error.config);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;

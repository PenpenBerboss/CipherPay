require('dotenv').config();
const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const csrf         = require('csurf');
const { globalLimiter } = require('./middlewares/rateLimit.middleware');
const authRoutes   = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const logsRoutes = require('./routes/logs.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ── Sécurité headers HTTP (Helmet) ────────────
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc:  ["'self'"],
    styleSrc:   ["'self'", "'unsafe-inline'"],
    imgSrc:     ["'self'", "data:"],
  },
}));

// ── CORS ──────────────────────────────────────
const allowedOrigins = ['http://localhost:3000', 'https://localhost:3000'];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(cors({
  origin:      allowedOrigins,
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// ── Body parser ───────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// ── Cookie parser (requis pour CSRF) ─────────
app.use(cookieParser());

// ── CSRF Protection ───────────────────────────
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production' || process.env.ENABLE_HTTPS === 'true',
    sameSite: 'strict',
  },
});

// ── Rate limit global ─────────────────────────
app.use(globalLimiter);

// ── Route pour obtenir le token CSRF ──────────
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ── Routes Auth (avec CSRF) ───────────────────
app.use('/api/auth', csrfProtection, authRoutes);
app.use('/api/transactions', csrfProtection, transactionRoutes);
app.use('/api/logs', csrfProtection, logsRoutes);
// ── Health check (sans CSRF) ──────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── Gestion des erreurs ───────────────────────
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Token CSRF invalide ou manquant.' });
  }
  next(err);
});

app.use(errorMiddleware);

module.exports = app;

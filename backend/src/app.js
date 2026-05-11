const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Middleware de sécurité
// Helmet configure automatiquement des en-têtes sécurisés (comme HSTS) si le trafic est détecté comme étant HTTPS.
// En production, la terminaison TLS/SSL doit être gérée par un proxy inverse d'infrastructure (comme Nginx) 
// qui transfère ensuite le trafic vers cette application en HTTP.
app.use(helmet());
app.use(cors({ origin: '*', credentials: true })); // À configurer en production (restreindre au domaine du frontend)

// Redirection automatique de HTTP vers HTTPS en production
app.use((req, res, next) => {
    // Vérifie si la demande provient d'un proxy qui a terminé la connexion SSL
    if (req.headers['x-forwarded-proto'] === 'http') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);

// Gestion des erreurs
app.use(errorHandler);

module.exports = app;

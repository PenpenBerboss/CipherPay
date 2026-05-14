const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const app    = require('./app');
const logger = require('./utils/logger');

require('dotenv').config();

const PORT       = process.env.PORT || 5000;
const PORT_HTTP  = process.env.PORT_HTTP || 5001;

// Certificats SSL
const sslOptions = {
  key:  fs.readFileSync(path.join(__dirname, '../certs/localhost+1-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/localhost+1.pem')),
};

// Serveur HTTPS principal
https.createServer(sslOptions, app).listen(PORT, () => {
  logger.info(`Serveur HTTPS démarré sur le port ${PORT}`);
  console.log(` Serveur HTTPS : https://localhost:${PORT}`);
  console.log(` Health        : https://localhost:${PORT}/api/health`);
});

// Serveur HTTP redirige vers HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://localhost:${PORT}${req.url}` });
  res.end();
}).listen(PORT_HTTP, () => {
  console.log(`↪️  Redirection HTTP : http://localhost:${PORT_HTTP} → HTTPS`);
});

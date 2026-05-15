const mysql2 = require('mysql2/promise');
require('dotenv').config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  database: process.env.DB_NAME || 'ewallet_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test de connexion au démarrage
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL connecté avec succès');
    conn.release();
  } catch (err) {
    console.error('Erreur connexion MySQL :', err.message);
    process.exit(1);
  }
})();

module.exports = pool;

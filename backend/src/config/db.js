const mysql2 = require("mysql2/promise");
require("dotenv").config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3307,
  database: process.env.DB_NAME || "ewallet_db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const ensureSchema = async () => {
  const connection = await pool.getConnection();

  try {
    const [roleColumn] = await connection.execute(
      `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'users'
         AND COLUMN_NAME = 'role'`,
      [process.env.DB_NAME || "ewallet_db"]
    );

    if (!Number(roleColumn[0]?.count || 0)) {
      await connection.execute(
        `ALTER TABLE users
         ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' AFTER last_name`
      );
      console.log("Colonne role ajoutée à la table users");
    }

    await connection.execute(
      `UPDATE users
       SET role = 'user'
       WHERE role IS NULL OR role = ''`
    );

    const [transactionKindColumn] = await connection.execute(
      `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME = 'transactions'
         AND COLUMN_NAME = 'transaction_kind'`,
      [process.env.DB_NAME || "ewallet_db"]
    );

    if (!Number(transactionKindColumn[0]?.count || 0)) {
      await connection.execute(
        `ALTER TABLE transactions
         ADD COLUMN transaction_kind VARCHAR(20) NOT NULL DEFAULT 'transfer' AFTER status`
      );
      console.log("Colonne transaction_kind ajoutée à la table transactions");
    }

    await connection.execute(
      `UPDATE transactions
       SET transaction_kind = 'transfer'
       WHERE transaction_kind IS NULL OR transaction_kind = ''`
    );

    await connection.execute(
      `CREATE TABLE IF NOT EXISTS notifications (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id varchar(36) NOT NULL,
        type varchar(50) NOT NULL,
        title varchar(120) NOT NULL,
        message varchar(255) NOT NULL,
        is_read tinyint(1) DEFAULT 0,
        created_at datetime DEFAULT current_timestamp(),
        PRIMARY KEY (id),
        KEY idx_notifications_user_id (user_id),
        KEY idx_notifications_is_read (is_read),
        KEY idx_notifications_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci`
    );
  } finally {
    connection.release();
  }
};

// Test de connexion au démarrage
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL connecté avec succès");
    conn.release();

    await ensureSchema();
  } catch (err) {
    console.error("Erreur connexion MySQL :", err.message);
    process.exit(1);
  }
})();

module.exports = pool;

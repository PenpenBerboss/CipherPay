# NeuroVault Backend - README

Architecture sécurisée pour l'e-Wallet NeuroVault.

## Installation
1. `cd backend`
2. `npm install`
3. Copiez `.env.example` dans `.env` et remplissez vos credentials MySQL.

## Database
1. Ouvrez phpMyAdmin via WampServer.
2. Créez une base de données nommée `neurovault_db`.
3. Le serveur backend synchronisera automatiquement les tables via Sequelize au lancement.

## Lancement
`npm run dev` (développement avec nodemon) OU `npm start` (production)

## Architecture
- `src/config`: Configuration (BDD, JWT)
- `src/models`: Modèles Sequelize
- `src/controllers`: Logique de requêtes
- `src/services`: Logique métier
- `src/middlewares`: Protections (RateLimit, Auth, Validation)

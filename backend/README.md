# CipherPay Backend

Backend Node.js / Express de l’application CipherPay, responsable de l’authentification, des transactions, des notifications, des journaux d’activité et des contrôles de sécurité.

## Vue d’ensemble

Le backend expose une API REST destinée au frontend React. Il s’appuie sur :

- **Express** pour le serveur HTTP
- **MySQL** pour la persistance des données
- **JWT** pour l’authentification
- **Middlewares de sécurité** pour la validation, le rate limiting et la protection des routes
- **Services métier** pour les transactions, l’authentification et les notifications

## Fonctionnalités principales

### Authentification
- inscription utilisateur
- connexion sécurisée
- gestion des tentatives de connexion
- support du MFA / OTP côté logique applicative
- contrôle des accès par rôle

### Transactions
- création de transferts
- dépôts
- historique des mouvements
- détails d’une transaction
- gestion du registre des opérations

### Notifications
- récupération des notifications de sécurité
- marquage d’une notification comme lue
- marquage global comme lu
- alimentation du badge de notifications dans l’interface

### Journaux et supervision
- logs d’activité
- suivi des événements sensibles
- préparation à l’audit de sécurité

## Architecture du projet

```text
backend/
├── database/              # Dump SQL et ressources liées à la base
├── logs/                  # Fichiers de logs applicatifs
├── src/
│   ├── app.js             # Configuration Express
│   ├── server.js          # Point d’entrée du serveur
│   ├── config/            # Connexion base de données
│   ├── controllers/       # Contrôleurs HTTP
│   ├── middlewares/       # Auth, validation, rate limit, gestion d’erreurs
│   ├── models/            # Modèles de données
│   ├── routes/            # Routes API
│   ├── services/          # Logique métier
│   └── utils/             # JWT, logs, TOTP
├── package.json
└── .env.example
```

## Routes API

Les routes disponibles sont organisées autour des modules suivants :

- `auth.routes.js` : authentification, inscription, connexion
- `transaction.routes.js` : dépôts, transferts, historique
- `notifications.routes.js` : récupération et gestion des notifications
- `logs.routes.js` : consultation des journaux

## Installation

1. Aller dans le dossier backend :
   ```bash
   cd backend
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Copier le fichier d’environnement :
   ```bash
   copy .env.example .env
   ```

4. Remplir les variables d’environnement MySQL et JWT dans `.env`

## Configuration base de données

1. Créer une base MySQL dédiée.
2. Importer si besoin le dump situé dans :
   ```text
   backend/database/ewallet_db_dump.sql
   ```
3. Vérifier la configuration de connexion dans `backend/src/config/db.js`

Le backend synchronise les tables au démarrage selon la configuration de l’application.

## Démarrage

### Développement
```bash
npm run dev
```

### Production
```bash
npm start
```

## Notes d’exécution

- Si les certificats SSL ne sont pas présents, le serveur bascule en **HTTP**.
- Le serveur expose l’API sur le port défini dans la configuration, généralement `5000`.
- Les logs applicatifs sont conservés dans le dossier `backend/logs/`.

## Intégration avec le frontend

Le frontend consomme ce backend pour :

- la connexion et l’inscription
- le chargement du dashboard utilisateur
- les transferts et dépôts
- les notifications de sécurité
- les pages de logs et de supervision

Les services frontend correspondants se trouvent dans `src/services/`.

## Sécurité

Le backend inclut plusieurs couches de protection :

- validation d’entrée
- rate limiting
- middlewares d’authentification
- contrôle de rôle
- journalisation des événements sensibles

## Remarques importantes

- Le frontend a récemment été allégé visuellement sur le dashboard pour améliorer la lisibilité.
- Le panneau de notifications du dashboard est désormais prévu pour s’afficher au-dessus du contenu principal.
- L’application reste conçue pour évoluer vers une intégration complète backend/frontend plus avancée.

## Commandes utiles

- `npm run dev` : lancer le backend en développement
- `npm start` : lancer le backend en production
- `npm install` : installer les dépendances

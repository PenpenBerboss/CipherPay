# CipherPay - Système Cryptographique E-Wallet

CipherPay est une application e-Wallet sécurisée de démonstration, conçue autour du thème de la **conception et de la réalisation d’un système cryptographique des transactions financières et des données sensibles**.

Le frontend est orienté FinTech / cybersécurité avec une interface sombre, structurée et prête à dialoguer avec un backend Node.js sécurisé.

## Vue d’ensemble

L’application couvre les parcours principaux suivants :

- authentification sécurisée
- vérification OTP / MFA
- tableau de bord utilisateur
- transferts et dépôts
- historique des transactions
- notifications de sécurité
- profil, logs et sécurité du compte
- interface d’administration utilisateur

## Fonctionnalités implémentées

### Authentification & identité sécurisée
- validation stricte des mots de passe
- indicateur dynamique de robustesse
- protection anti-brute force avec verrouillage temporaire
- messages d’erreur génériques pour éviter l’énumération des comptes
- pages de connexion, inscription et vérification OTP

### MFA / TOTP
- configuration MFA avec QR code simulé et clé secrète
- vérification OTP à 6 chiffres
- navigation sécurisée via jeton temporaire avant session complète
- écran de configuration MFA dédié

### Architecture frontend
- état global géré avec Zustand
- services HTTP centralisés avec Axios
- guards de routes React
- gestion de session et d’inactivité
- composants UI atomiques réutilisables

### Dashboard utilisateur
- vue synthétique du solde principal
- actions rapides pour envoyer, déposer et actualiser
- carte portefeuille simplifiée
- indicateurs identité / sécurité
- indicateur réseau
- liste des mouvements récents
- accès aux détails d’une transaction

### Notifications de sécurité
- bouton de notifications dans l’en-tête du dashboard
- panneau de notifications superposé correctement au-dessus du contenu
- lecture individuelle ou globale des notifications
- séparation claire entre les notifications de sécurité et le reste de l’interface

### Améliorations visuelles récentes
- dashboard rendu plus épuré et plus aéré
- réduction des effets lourds sur les sections principales
- suppression des ombres marquées sur les cartes du dashboard
- hiérarchie visuelle allégée pour éviter les superpositions gênantes
- meilleure lisibilité des blocs principaux et des cartes de synthèse

### Sécurité & supervision
- journal d’activité système
- suivi du score de sécurité du compte
- pages de sécurité et de profil
- préparation à des extensions futures côté biométrie et MFA renforcée

## Stack technique

- **Framework** : React 19, Vite, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **State Management** : Zustand
- **Animations** : Framer Motion
- **Formulaires & validation** : React Hook Form, Zod
- **Routage** : React Router
- **HTTP** : Axios
- **Graphiques** : Recharts
- **Icônes** : Lucide React

## Structure du projet

```text
src/
├── components/
│   ├── auth/         # OTP, robustesse mot de passe, état compte verrouillé
│   ├── dashboard/    # Modales et éléments liés au dashboard
│   ├── guards/       # Protection des routes
│   ├── layout/       # Layout global auth / dashboard
│   └── ui/           # Composants UI atomiques
├── features/         # Parcours métier, notamment auth
├── hooks/            # Hooks personnalisés
├── mock/             # Données mockées
├── pages/            # Pages principales et dashboard
├── services/         # Accès API et abstractions réseau
├── store/            # États globaux Zustand
├── types/            # Types TypeScript
└── utils/            # Constantes, validations et helpers
```

## Lancement

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Démarrer le frontend :
   ```bash
   npm run dev
   ```

3. Ouvrir l’application :
   - `http://localhost:3000`

## Notes d’intégration backend

Le frontend est déjà structuré pour consommer un backend réel via les services présents dans `src/services/` :

- authentification
- transactions
- notifications
- stockage et rotation du token
- synchronisation du solde utilisateur

## Points importants de l’interface

- le dashboard privilégie maintenant une lecture plus claire
- les sections sont plus légères visuellement
- les notifications sont affichées au-dessus du contenu principal
- les cartes ne projettent plus d’ombres massives sur les blocs du dashboard

## Commandes utiles

- `npm run dev` : lancer le serveur de développement
- `npm run build` : générer la version de production
- `npm run lint` : vérifier les types TypeScript

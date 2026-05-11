# NeuroVault - Système Cryptographique E-Wallet

NeuroVault est une application e-Wallet sécurisée de démonstration, conçue autour du thème de la **"Conception et Réalisation d'un système cryptographique des transactions financières et des données sensibles"**.

Le frontend est architecturé pour offrir une expérience utilisateur de type FinTech / Cybersécurité (Glassmorphism, Dark premium, animations fluides), tout en étant **entièrement préparé pour une intégration avec un backend sécurisé Node.js**.

## 🚀 Fonctionnalités Implémentées

### 🔐 Authentification & Identité Sécurisée
- **Validation Stricte des Mots de Passe** : Exigences de sécurité (minimum de caractères, majuscule, chiffre, caractère spécial).
- **Indicateur de Robustesse Dynamique** : Feedback en temps réel avec barre de progression de force du mot de passe.
- **Protection Anti-Brute Force** : Système de verrouillage de compte (mocké à 15 minutes après 5 tentatives échouées) avec compte à rebours en direct.
- **Messages d'Erreur Génériques** : Ne révèle jamais si un identifiant existe dans le système pour éviter l'énumération de comptes.

### 🛡️ Multi-Factor Authentication (MFA / TOTP)
- **Configuration MFA** : Interface générant un QR Code simulé et une clé secrète pour les applications de type authenticator.
- **Vérification OTP** : Saisie du code à 6 chiffres avec auto-focus, gestion optimisée du clavier et compte à rebours pour le renvoi.
- **Workflow Sécurisé** : L'utilisateur navigue via un jeton temporaire vers l'écran d'OTP avant de recevoir son véritable jeton de session JWT.

### 🏗️ Architecture "Backend-Ready"
- **Zustand State Management** : Séparation de l'état d'authentification (`auth.store.ts`) et de l'état de l'application (`index.ts`).
- **Axios Interceptors** : Injection automatique du token JWT (`Bearer`) et intercepteur réseau prêt pour la logique de rotation de Refresh Token (erreur `401`).
- **Guards de Routes React** : 
  - `AuthGuard` : Restreint l'accès aux pages internes.
  - `GuestGuard` : Redirige vers le tableau de bord si déjà connecté, gère le routage des étapes OTP en cours de route.
- **Timeout & Idle Session** : La session locale s'invalide de manière sécurisée en cas d'inactivité (pré-configuré à 1 heure).

### 💳 Dashboard & E-Wallet
- **Tableau de Bord Global** : Aperçu de la balance du registre cryptographique, graphiques de nœuds synchronisés.
- **Moteur de Transferts** : Interface transactionnelle en plusieurs étapes pour "signer" et "diffuser" une preuve cryptographique sur le réseau.
- **Historique des Transactions** : Registre avec recherche, affichage des hashs de transaction et des statuts (Confirmé, En Attente, Rejeté).
- **Centre de Sécurité** : Suivi du score d'immunité du compte de l'utilisateur, gestion de l'activation/désactivation du MFA et de la biométrie (prêts pour branchement futur).
- **Journaux d'Activité Système** : Suivi transparent des événements et des adresses IP.

## 🛠️ Stack Technique

- **Framework** : React 18, Vite, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui (Radix UI)
- **State Management** : Zustand
- **Animations** : Framer Motion
- **Formulaires & Validations** : React Hook Form, Zod
- **Routage** : React Router v6
- **Requêtes API / HTTP** : Axios
- **Icônes** : Lucide React

## 🔌 Intégration Backend (À Venir)

Le projet est doté de commentaires ("NODE.JS INTEGRATION NOTE") dans de nombreux fichiers clés (ex: `src/services/auth.service.ts`, `src/services/api.ts`).
Ces indications guident le déploiement des véritables mécanismes serveurs :

1. Relier `AuthService` aux vraies routes Node.js/Express.
2. Implémenter et remplacer par `speakeasy` ou `otplib` dans l'API pour les secrets TOTP partagés.
3. Supprimer JWT de la génération locale (`mock/auth.ts`) pour utiliser la vraie vérification asymétrique du serveur.
4. Compléter la logique asynchrone des services financiers simulés du Tableau de Bord.

## 📂 Structure du Répertoire
```text
src/
├── components/
│   ├── auth/         # Composants liés à l'authentification (Input OTP, Barre de robustesse, Verrouillage)
│   ├── guards/       # Protection des accès aux routes React
│   ├── layout/       # Squelettes visuels (Navbar, Sidebar)
│   └── ui/           # Composants atomiques (Boutons, Input, Card) via shadcn
├── hooks/            # Hooks personnalisés (MFA, password, timeout idle session)
├── mock/             # Données mockées (Utilisateurs de base, Transactions, JWT Factice)
├── pages/            # Écrans principaux (Login, Register, Dashboard, Security...)
├── services/         # Layer réseau HTTP (Axios interceptor, Token storage, Auth proxy)
├── store/            # Magasins Zustand liés à l'authentification et au Core
├── types/            # Interfaces et définitions TypeScript
└── utils/            # Constantes et schémas de validation Zod
```

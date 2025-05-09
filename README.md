# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
Dentiflow - Application de Gestion Dentaire (Frontend)
Description
Dentiflow est une application web frontend développée avec React et Vite, conçue pour gérer un cabinet dentaire. Elle inclut l'authentification (connexion, inscription, réinitialisation du mot de passe), la gestion des salles (ajout, suppression, affichage), et la gestion des comptes (informations utilisateur, changement de mot de passe, suppression de compte). L'application utilise Tailwind CSS pour le style, React Router pour la navigation, et localStorage pour simuler la persistance des données.
Structure du projet
dentiflow/
├── public/                  # Fichiers statiques
│   ├── vite.svg
├── src/
│   ├── assets/              # Ressources statiques (vide)
│   ├── components/          # Composants réutilisables
│   │   ├── Navbar.jsx
│   │   ├── RoomForm.jsx
│   │   ├── RoomList.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ForgotPasswordForm.jsx
│   │   ├── AccountManagement.jsx
│   ├── context/             # Contexte pour l'authentification
│   │   ├── AuthContext.jsx
│   ├── pages/               # Pages principales
│   │   ├── AuthPage.jsx
│   │   ├── RoomsPage.jsx
│   │   ├── AccountPage.jsx
│   ├── App.jsx              # Composant racine avec le routeur
│   ├── main.jsx             # Point d'entrée
│   ├── index.css            # Styles globaux (Tailwind)
├── .gitignore               # Fichiers à ignorer
├── index.html               # Fichier HTML principal
├── package.json             # Dépendances et scripts
├── vite.config.js           # Configuration de Vite
├── tailwind.config.js       # Configuration de Tailwind CSS
├── postcss.config.js        # Configuration de PostCSS
└── README.md                # Documentation

Prérequis

Node.js (version 18 ou supérieure) : Télécharger
Visual Studio Code (recommandé) : Télécharger
Un navigateur web moderne (Chrome, Firefox, etc.)

Installation

Clonez ou téléchargez ce projet dans un dossier :git clone <votre-repo-url> dentiflow
cd dentiflow


Installez les dépendances :npm install


Configurez Tailwind CSS (si non déjà fait) :npx tailwindcss init -p



Exécution

Lancez le serveur de développement :npm run dev


Ouvrez votre navigateur et accédez à http://localhost:5173 (ou le port indiqué par Vite).
L'application charge la page d'accueil, qui redirige vers /auth (connexion) si vous n'êtes pas connecté, ou /rooms si vous l'êtes.

Utilisation

Connexion/Inscription : Sur /auth, connectez-vous ou créez un compte. Les données sont stockées dans localStorage.
Gestion des salles : Sur /rooms, ajoutez ou supprimez des salles. Les salles sont persistées dans localStorage.
Gestion du compte : Sur /account, consultez vos informations, changez votre mot de passe, ou supprimez votre compte.
Déconnexion : Disponible dans la barre de navigation, retourne à /auth et efface les données de session.

Construire pour la production

Générez une version optimisée :npm run build


Prévisualisez la version construite :npm run preview


Les fichiers générés se trouvent dans le dossier dist/.

Remarques

Toutes les interactions (connexion, inscription, etc.) sont simulées avec des délais et des alertes, car l'application est frontend uniquement.
Les données dans localStorage sont perdues si le cache du navigateur est effacé.
Pour déboguer, ouvrez la console du navigateur (F12) et inspectez localStorage pour voir les clés user et rooms.
Le projet utilise Vite pour un développement rapide et une construction optimisée.

Développement dans VS Code

Extensions recommandées :
ESLint : Détection des erreurs JavaScript.
Prettier : Formatage automatique du code.
Tailwind CSS IntelliSense : Autocomplétion pour Tailwind.


Configuration :
Activez editor.formatOnSave dans les paramètres pour formater automatiquement.
Utilisez le terminal intégré de VS Code pour exécuter les commandes npm.



Développeur
Créé avec l'assistance de Grok 3, construit par xAI.

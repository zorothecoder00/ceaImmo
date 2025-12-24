🧠 CEA-IMMO
![Licence: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Plateforme web moderne de gestion immobilière permettant aux acheteurs, vendeurs, agents et entreprises de vendre, louer, réserver des maisons, villas, appartements, hôtels et bientôt de gérer des services de voyage (billets d’avion), avec paiements sécurisés, notifications et statistiques avancées.

📚 Table des matières

🎯 Objectif

🛠️ Technologies utilisées

⚙️ Installation  

🧩 Structure de la base de données

🔌 API

🔐 Rôles

📦 Dépendances

📜 Scripts NPM

🧪 Tests

✍️ Auteur

🎯 Objectif

CEA-IMMO permet de :

S’inscrire et se connecter via Next-Auth

Publier et gérer des annonces immobilières

Acheter, louer ou réserver des biens

Gérer des hôtels, chambres et disponibilités

Programmer des visites

Faire des offres de négociation

Effectuer des paiements multi-modes

Laisser des avis

Sauvegarder des favoris

Échanger via une messagerie interne

Recevoir des notifications en temps réel

Consulter des statistiques d’activité

Gérer le profil utilisateur (langue, thème, confidentialité)

🛠️ Technologies utilisées
🖥️ Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

NextAuth (Auth.js)

Axios

Zod

Chart.js / Recharts

FullCalendar

🧱 Backend & Base de données

Prisma ORM

PostgreSQL

UploadThing / Cloudinary (images)

Formidable

Bcrypt / BcryptJS

⚙️ Installation

Cloner le projet

git clone https://github.com/ton-compte/cea-immo.git
cd cea-immo


Installer les dépendances

npm install


Configurer l’environnement
Créer un fichier .env :

DATABASE_URL=postgresql://user:password@localhost:5432/cea-immo
NEXTAUTH_SECRET=super_secret_key
NEXTAUTH_URL=http://localhost:3000


Initialiser Prisma

npx prisma generate
npx prisma db push


Démarrer le serveur

npm run dev

🧩 Structure de la base de données
Modèle	Description
User	Utilisateurs (acheteur, vendeur, agent, admin…)
Propriete	Biens immobiliers
Hotel	Informations spécifiques aux hôtels
Chambre	Chambres d’hôtel
Disponibilite	Périodes de disponibilité
Reservation	Réservations & séjours
Offre	Négociation des prix
Transaction	Paiements
Visite	Visites programmées
Favori	Annonces favorites
Avis	Notes & commentaires
Message	Messagerie interne
Notification	Notifications système
Log	Journal des actions
Recherche	Recherches sauvegardées
Signalement	Signalement d’annonces
🔌 API (exemples)
🏠 Propriétés

GET /api/proprietes

POST /api/proprietes

GET /api/proprietes/:id

PUT /api/proprietes/:id

DELETE /api/proprietes/:id

🏨 Hôtels & chambres

GET /api/hotels

GET /api/hotels/:id/chambres

POST /api/chambres

📅 Réservations

POST /api/reservations

GET /api/mesReservations

💳 Transactions

POST /api/paiements

GET /api/transactions

🔔 Notifications

GET /api/notifications

PUT /api/notifications/:id

🔐 Rôles
🌍 Rôles globaux

ADMIN — Gestion complète

AGENT — Gestion des ventes, visites et transactions

VENDEUR — Publication de biens

ACHETEUR — Réservations, paiements

ENTREPRISE — Gestion immobilière avancée

📜 Scripts NPM importants
"check": "npm run lint && tsc --noEmit && next build",
"postinstall": "prisma generate",
"deploy:prod": "dotenv -e .env.production -- npx prisma migrate deploy"

🧪 Tests

Tests API avec Postman

Tests automatisés possibles avec Jest / Playwright

✍️ Auteur

Projet développé par AMOUSSOU-GUENOU Awledou
Encadré par Mr Nelson AKPABI
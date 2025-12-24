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

🚧 Statut du projet

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

Fetch API (native Next.js)

Zod

Openrouteservice

Chart.js / Recharts

FullCalendar

🧱 Backend & Base de données

Prisma ORM

PostgreSQL

UploadThing / Cloudinary (images)

Formidable
  
🔔 Notifications en temps réel → Pusher ✅

💳 Paiements multi-modes → Stripe ✅

📧 Emails → Nodemailer / SendGrid ✅

🗺️ Google Maps → @react-google-maps/api ✅

📱 SMS (Twilio) → Twilio ✅

Recherche avancée (ElasticSearch – en cours / partielle)

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
Les endpoints sont implémentés via le système de routes API de Next.js (App Router).

🏠 Accueil

GET /api/accueil — Voir sur la page d'accueil quelques propriétés disponibles sans connexion

🏨 Hôtels

GET /api/vendeur/mesHotels — Voir mes hôtels

POST /api/vendeur/mesHotels — Ajouter mes hôtels
  
📅 Réservations

POST /api/acheteur/rechercheHotels — Lancer les recherches par filtre pour les hotels

POST /api/reservationsHotel — Faire une demande de réservation

POST /api/reservationsHotel/:id — Voir en détails l'hôtel que je veux ou que j'ai réservé

💳 Transactions

GET /api/acheteur/mesOffres — Voir l'état de mes offres en général

GET /api/acheteur/mesOffres — Faire une offre pour une propriété

GET /api/acheteur/mesOffres/:id — Voir l'état de mon offre

POST /api/acheteur/mesTransactions/initier.ts — Initier une transaction

PATCH /api/acheteur/mesTransactions/finaliser.ts — Finaliser une transaction


🔔 Notifications

GET /api/notifications — Lire mes notifications + filtrage sur non lue

PUT /api/notifications/:id — Marquer comme lue

DELETE /api/notifications/:id — Supprimer une ou toutes les notifications en même temps

🔐 Rôles
🌍 Rôles globaux

ADMIN — Gestion complète des utilisateurs + modération

AGENT — Gestion des ventes, visites et transactions

VENDEUR — Publication de biens et négociations des offres

ACHETEUR — Réservations, paiements

ENTREPRISE — Gestion immobilière avancée

📜 Scripts NPM importants
✅ Vérification complète du projet (check)
"check": "npm run lint && tsc --noEmit && next build"


Ce script permet d’effectuer une vérification complète du projet avant un déploiement ou un commit important.
Il exécute successivement :

npm run lint
Analyse le code avec ESLint afin de détecter :

les erreurs de syntaxe

les mauvaises pratiques

les incohérences de style

tsc --noEmit
Vérifie le typage TypeScript sans générer de fichiers :

garantit la cohérence des types

évite les erreurs de typage en production

next build
Lance le build de production Next.js :

vérifie que toutes les pages, API routes et composants serveur/client sont valides

détecte les erreurs liées au rendu serveur, à Prisma ou aux imports dynamiques

🧠 Ce script est essentiel pour prévenir les erreurs de build, de typage ou de runtime avant la mise en production.

🧬 Génération automatique du client Prisma (postinstall)
"postinstall": "prisma generate"


Ce script est automatiquement exécuté après chaque :

npm install

clonage du projet

déploiement sur une plateforme (Vercel, Railway, etc.)

Il permet de :

Générer le client Prisma (@prisma/client) à partir du fichier schema.prisma

Synchroniser le client ORM avec la structure réelle de la base de données

Éviter les erreurs du type "Prisma Client not generated"

🛠️ Indispensable pour assurer le bon fonctionnement de Prisma en environnement local et en production.

🗃️ Migrations Prisma en environnement de développement
"prisma:migrate": "prisma migrate dev"


Ce script sert à :

Créer et appliquer des migrations Prisma en local

Mettre à jour automatiquement la base de données de développement

Générer un historique clair des évolutions du schéma

📌 Utilisé principalement pendant le développement pour faire évoluer la base de données.

🧪 Prisma Studio (interface visuelle)
"prisma:studio": "prisma studio"


Ce script permet d’ouvrir Prisma Studio, une interface graphique pour :

Visualiser les tables de la base de données

Créer, modifier ou supprimer des enregistrements

Déboguer rapidement les données sans écrire de requêtes SQL

🔍 Très utile pour le debug et les tests manuels.

🚀 Déploiement des migrations en production (Neon / PostgreSQL distant)
"deploy:prod": "dotenv -e .env.production -- npx prisma migrate deploy"


Ce script permet de :

Charger les variables d’environnement depuis .env.production

Appliquer les migrations Prisma sur la base de données distante (ex : Neon)

Synchroniser le schéma Prisma avec la base de production

💾 Utilisé lors du déploiement pour garantir que la base de données distante est à jour.

⚠️ Ce script ne crée pas de nouvelles migrations, il applique uniquement celles déjà existantes.

🔍 Audit et maintenance des dépendances
"check-deps": "npm outdated && npm audit --audit-level=moderate || exit 0 && npm ls deprecated || exit 0"


Ce script sert à :

Identifier les dépendances obsolètes

Vérifier les failles de sécurité connues

Détecter les packages dépréciés

🧠 Utile pour maintenir un projet sain, sécurisé et à jour sur le long terme.

🚧 Statut du projet
CEA-IMMO est en cours de développement actif.
Certaines fonctionnalités avancées (voyages, IA, recommandations) sont prévues pour les prochaines versions.

🧪 Tests

Tests API avec Postman

Tests automatisés possibles avec Jest / Playwright

✍️ Auteur

Projet développé par AMOUSSOU-GUENOU Awledou
Encadré par Mr Nelson AKPABI  
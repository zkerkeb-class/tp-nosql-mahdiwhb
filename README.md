# PokeTeam - TP NoSQL 2026

Projet réalisé dans le cadre du TP NoSQL : API REST Pokémon avec Express.js + MongoDB, avec interface web complète pour manipuler les données (Pokédex, favoris, équipes).

## Objectif du projet

Construire une API complète autour des 151 Pokémon de la 1re génération, puis ajouter des fonctionnalités avancées:

- CRUD complet
- filtres, tri, pagination
- authentification JWT
- favoris
- statistiques MongoDB
- gestion d'équipes

## Stack technique

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Frontend Vanilla JS + HTML + CSS

## Fonctionnalités réalisées (par rapport à la consigne)

### Partie 1 - Routes Express

- GET /api/pokemons
- GET /api/pokemons/:id

### Partie 2 - MongoDB + modèle Mongoose

- Connexion MongoDB au démarrage du serveur
- Modèle Pokemon
- Script de seed pour importer les 151 Pokémon

### Partie 3 - CRUD complet

- POST /api/pokemons (protégée)
- PUT /api/pokemons/:id (protégée)
- DELETE /api/pokemons/:id (protégée)

### Partie 4 - Filtres, tri, pagination

- Filtre par type
- Recherche par nom (regex, insensible à la casse)
- Tri asc/desc sur différents champs
- Pagination avec métadonnées (page, limit, total, totalPages)

### Partie 5 - Authentification JWT

- POST /api/auth/register
- POST /api/auth/login
- Middleware d'authentification JWT
- Protection des routes sensibles

### Partie 6 - Bonus demandés

- 6.A Favoris:
  - POST /api/auth/favorites/:pokemonId
  - DELETE /api/auth/favorites/:pokemonId
  - GET /api/auth/favorites
- 6.B Statistiques avancées:
  - GET /api/pokemons/stats/overview
  - GET /api/pokemons/stats/by-type
- 6.C Validation avancée:
  - types Pokémon validés (18 types officiels)
  - stats encadrées (1-255)
  - messages d'erreur en français
- 6.D Équipes:
  - POST /api/teams
  - GET /api/teams
  - GET /api/teams/:id
  - PUT /api/teams/:id
  - DELETE /api/teams/:id

## Bonus réalisés en plus de la consigne

En plus du cahier des charges, le projet a été poussé plus loin:

- Interface web complète (pas seulement une API) dans le dossier public
- Expérience utilisateur complète:
  - authentification depuis l'interface
  - affichage dynamique du profil connecté
  - navigation par onglets (Pokédex, Mon Pokédex, Mes Équipes)
  - modales pour auth, détail Pokémon, création/édition d'équipe
- Intégration de toutes les actions API dans l'interface:
  - ajout/retrait favoris en direct
  - création/édition/suppression d'équipes
  - ajout de Pokémon à une équipe depuis la fiche détail
- Route utilitaire supplémentaire:
  - GET /api/auth/me (récupération du profil utilisateur connecté)
- Design et UI avancés:
  - thème visuel personnalisé
  - animations et micro-interactions
  - composants responsives (desktop/mobile)
- Documentation et livrables supplémentaires:
  - documentation API détaillée
  - guide setup MongoDB
  - collection Postman fournie
  - captures d'écran du rendu

## Installation

1. Installer les dépendances:

```bash
npm install
```

2. Configurer l'environnement (.env):

```env
PORT=3000
MONGODB_URI=<votre_uri_mongodb>
JWT_SECRET=<votre_secret_jwt>
API_URL=http://localhost:3000
```

3. Importer les données Pokémon:

```bash
npm run seed
```

4. Lancer le serveur:

```bash
npm run dev
```

## Accès

- App web: http://localhost:3000
- API Pokémon: http://localhost:3000/api/pokemons

## Scripts npm

- npm run dev: lancement serveur avec nodemon
- npm run seed: import des données Pokémon en base
- npm run import: import des données Pokémon en base

## Arborescence utile

- index.js: serveur principal
- db/connect.js: connexion MongoDB
- models/Pokemon.js: modèle Pokémon
- models/User.js: modèle utilisateur
- models/Team.js: modèle équipe
- routes/pokemons.js: routes Pokémon + stats
- routes/auth.js: auth + favoris
- routes/teams.js: routes équipes
- middleware/auth.js: middleware JWT
- public/index.html: interface web
- public/app.js: logique frontend
- public/styles.css: design frontend

## Captures

Le dossier screenshots contient des captures de:

- Pokédex
- Authentification
- Favoris
- Équipes
- Détail Pokémon

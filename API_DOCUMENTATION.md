# 🎮 API Pokémon NoSQL - Documentation Complète

Ce projet est une **API REST complète avec Express.js et MongoDB**, implémentant les 6 parties du TP NoSQL.

## 📋 Table des matières

- [Installation](#installation)
- [Démarrage](#démarrage)
- [Parties du projet](#parties-du-projet)
- [Routes API](#routes-api)
- [Exemples de requêtes](#exemples-de-requêtes)

---

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Créer le fichier .env (déjà existant, vérifiez-le)
cat .env

# Importer les 151 Pokémon dans MongoDB
npm run seed
```

---

## ▶️ Démarrage

```bash
# Mode développement (auto-reload avec nodemon)
npm run dev

# Le serveur démarre sur http://localhost:3000
```

---

## 📚 Parties du projet

### ✅ PARTIE 1 - Premières routes Express
- `GET /api/pokemons` — Liste tous les Pokémon
- `GET /api/pokemons/:id` — Récupère un Pokémon par ID

### ✅ PARTIE 2 - Connexion MongoDB & Modèles Mongoose
- Connexion à MongoDB Atlas configurée
- Modèle Pokemon avec validation
- Modèle User avec hashage bcrypt

### ✅ PARTIE 3 - CRUD complet
- `POST /api/pokemons` — **Créer un Pokémon (authentifié)**
- `PUT /api/pokemons/:id` — **Modifier un Pokémon (authentifié)**
- `DELETE /api/pokemons/:id` — **Supprimer un Pokémon (authentifié)**

### ✅ PARTIE 4 - Filtres, tri et pagination
- `GET /api/pokemons?type=Fire` — Filtrer par type
- `GET /api/pokemons?name=pika` — Rechercher par nom (insensible à la casse)
- `GET /api/pokemons?sort=-base.Attack` — Trier par stats (- = décroissant)
- `GET /api/pokemons?page=1&limit=20` — Pagination (par défaut: limit=50)
- **Combinable** : `GET /api/pokemons?type=Fire&sort=-base.Attack&page=1&limit=5`

### ✅ PARTIE 5 - Authentification JWT
- `POST /api/auth/register` — Inscription
- `POST /api/auth/login` — Connexion (retourne JWT)
- **Routes protégées** : POST, PUT, DELETE sur `/api/pokemons`

### ✅ PARTIE 6 - Bonus

#### 6.A - Système de favoris
- `POST /api/auth/favorites/:pokemonId` — Ajouter un favori
- `DELETE /api/auth/favorites/:pokemonId` — Retirer un favori
- `GET /api/auth/favorites` — Liste mes Pokémon favoris

#### 6.B - Statistiques
- `GET /api/pokemons/stats/overview` — Statistiques globales
- `GET /api/pokemons/stats/by-type` — Statistiques par type

#### 6.C - Validation
- Types Pokémon validés (18 types autorisés)
- Stats entre 1 et 255
- Messages d'erreur en français

#### 6.D - Équipes Pokémon
- `POST /api/teams` — Créer une équipe (max 6 Pokémon)
- `GET /api/teams` — Lister mes équipes
- `GET /api/teams/:id` — Détail d'une équipe (avec données complètes)
- `PUT /api/teams/:id` — Modifier une équipe
- `DELETE /api/teams/:id` — Supprimer une équipe

---

## 🔑 Routes API détaillées

### 🔓 **Routes Publiques (sans authentification)**

#### GET /api/pokemons
Récupère tous les Pokémon avec pagination.

```
Réponse :
{
  "data": [ ... ],
  "page": 1,
  "limit": 50,
  "total": 151,
  "totalPages": 4
}
```

#### GET /api/pokemons/:id
Récupère un Pokémon spécifique.

```
GET /api/pokemons/25
Réponse :
{
  "_id": "...",
  "id": 25,
  "name": { "english": "Pikachu", "french": "Pikachu", ... },
  "type": ["Electric"],
  "base": { "HP": 35, "Attack": 55, ... }
}
```

#### GET /api/pokemons/stats/overview
Statistiques globales de tous les Pokémon.

```
Réponse :
{
  "totalPokemons": 151,
  "avgHP": 54.2,
  "avgAttack": 69.1,
  "avgDefense": 67.8,
  "maxAttack": 134,
  "maxHP": 255
}
```

#### GET /api/pokemons/stats/by-type
Statistiques par type.

```
Réponse :
[
  {
    "_id": "Water",
    "count": 32,
    "avgHP": 58.5,
    "avgAttack": 72.1,
    "avgDefense": 71.2
  },
  ...
]
```

---

### 🔒 **Routes d'Authentification**

#### POST /api/auth/register
Créer un nouvel utilisateur.

```
Body :
{
  "username": "sacha",
  "password": "pikachu123"
}

Réponse (201) :
{
  "message": "Utilisateur créé avec succès",
  "username": "sacha"
}
```

#### POST /api/auth/login
Se connecter et obtenir un token JWT.

```
Body :
{
  "username": "sacha",
  "password": "pikachu123"
}

Réponse (200) :
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🛡️ **Routes Protégées (authentification requise)**

**Pour accéder à ces routes, ajoutez le header :**
```
Authorization: Bearer <votre_token_jwt>
```

#### POST /api/pokemons
Créer un nouveau Pokémon.

```
Headers :
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...

Body :
{
  "id": 152,
  "name": { "english": "Chikorita", "french": "Germignon" },
  "type": ["Grass"],
  "base": { "HP": 45, "Attack": 49, "Defense": 65, "Speed": 45 }
}

Réponse (201) : [Pokémon créé]
```

#### PUT /api/pokemons/:id
Modifier un Pokémon existant.

```
Headers :
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...

PUT /api/pokemons/25
Body :
{
  "base": { "HP": 40, "Attack": 60, ... }
}

Réponse (200) : [Pokémon modifié]
```

#### DELETE /api/pokemons/:id
Supprimer un Pokémon.

```
Headers :
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...

DELETE /api/pokemons/152

Réponse (204) : No Content
```

#### GET /api/auth/favorites
Lister mes Pokémon favoris.

```
Réponse (200) :
[25, 6, 39, 58]
```

#### POST /api/auth/favorites/:pokemonId
Ajouter un Pokémon aux favoris.

```
POST /api/auth/favorites/25

Réponse (200) : [User avec favorites mis à jour]
```

#### DELETE /api/auth/favorites/:pokemonId
Retirer un Pokémon des favoris.

```
DELETE /api/auth/favorites/25

Réponse (200) : [User avec favorites mis à jour]
```

#### GET /api/teams
Lister mes équipes.

```
Réponse (200) :
[
  {
    "_id": "...",
    "name": "Mon équipe",
    "pokemons": [25, 6, 39],
    "user": "..."
  },
  ...
]
```

#### POST /api/teams
Créer une nouvelle équipe.

```
Body :
{
  "name": "Mon équipe",
  "pokemons": [25, 6, 39, 58, 65, 4]
}

Réponse (201) : [Team créée]
```

#### GET /api/teams/:id
Détail d'une équipe avec les données complètes des Pokémon.

```
Réponse (200) :
{
  "_id": "...",
  "name": "Mon équipe",
  "pokemons": [25, 6, 39],
  "pokemonsData": [
    { id: 25, name: {...}, type: [...], ... },
    { id: 6, name: {...}, ... },
    ...
  ]
}
```

#### PUT /api/teams/:id
Modifier une équipe.

```
PUT /api/teams/...
Body :
{
  "name": "Nouvelle équipe",
  "pokemons": [25, 6, 39, 58, 65, 7]
}

Réponse (200) : [Team modifiée]
```

#### DELETE /api/teams/:id
Supprimer une équipe.

```
DELETE /api/teams/...

Réponse (204) : No Content
```

---

## 📝 Exemples de requêtes

### Avec cURL

```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"sacha","password":"pikachu123"}'

# Connexion (obtenir le token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sacha","password":"pikachu123"}'

# Utiliser le token
curl -X GET http://localhost:3000/api/teams \
  -H "Authorization: Bearer <VOTRE_TOKEN>"

# Filtrer par type
curl "http://localhost:3000/api/pokemons?type=Fire&limit=10"

# Rechercher par nom
curl "http://localhost:3000/api/pokemons?name=pika"

# Trier et paginer
curl "http://localhost:3000/api/pokemons?sort=-base.Attack&page=2&limit=5"
```

### Avec Thunder Client (VS Code)

1. Installez l'extension Thunder Client
2. Créez une nouvelle requête
3. Définissez l'URL et les headers
4. Cliquez sur "Send"

---

## 🧪 Tester l'API

### Étape 1 : Créer un utilisateur
```
POST http://localhost:3000/api/auth/register
Body :
{
  "username": "trainer",
  "password": "mypassword123"
}
```

### Étape 2 : Se connecter
```
POST http://localhost:3000/api/auth/login
Body :
{
  "username": "trainer",
  "password": "mypassword123"
}
```
→ Copiez le token reçu

### Étape 3 : Créer une équipe
```
POST http://localhost:3000/api/teams
Headers :
Authorization: Bearer <TOKEN>
Body :
{
  "name": "Ma première équipe",
  "pokemons": [25, 6, 39, 58, 65, 4]
}
```

### Étape 4 : Voir ses équipes
```
GET http://localhost:3000/api/teams
Headers :
Authorization: Bearer <TOKEN>
```

---

## 🔧 Fichiers du projet

```
tp-nosql-mahdiwhb/
├── index.js                 ← Point d'entrée
├── package.json
├── .env                     ← Variables d'environnement
├── models/
│   ├── Pokemon.js           ← Schéma Pokémon (validé)
│   ├── User.js              ← Schéma User (avec hashage bcrypt)
│   └── Team.js              ← Schéma Team (équipes)
├── routes/
│   ├── pokemons.js          ← Routes Pokémon (CRUD + stats + filtres)
│   ├── auth.js              ← Routes d'auth + favoris
│   └── teams.js             ← Routes d'équipes
├── middleware/
│   └── auth.js              ← Middleware JWT
├── db/
│   ├── connect.js           ← Connexion MongoDB
│   └── seed.js              ← Import de données
└── data/
    ├── pokemons.json        ← Les 151 Pokémon
    └── importPokemons.js    ← Script d'import
```

---

## ❌ Codes d'erreur

| Code | Signification |
|------|---------------|
| **200** | OK - Succès |
| **201** | Created - Ressource créée |
| **204** | No Content - Suppression réussie |
| **400** | Bad Request - Données invalides |
| **401** | Unauthorized - Token manquant/invalide |
| **404** | Not Found - Ressource non trouvée |
| **500** | Server Error - Erreur serveur |

---

## 🔐 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ Tokens JWT avec expiration 24h
- ✅ Validation des types et stats
- ✅ Protection auth sur les routes sensibles

---

## 📞 Besoin d'aide ?

1. Vérifiez que MongoDB Atlas est connecté
2. Vérifiez que le `.env` est correct
3. Relancez `npm run seed` pour réimporter les données
4. Consultez les logs serveur pour les erreurs

---

**Bon code ! 🚀**

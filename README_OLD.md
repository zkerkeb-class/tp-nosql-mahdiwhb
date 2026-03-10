# 🎮 API Pokémon NoSQL - TP Complet

**Projet Express.js + MongoDB** implémentant toutes les 6 parties du TP NoSQL avec authentification JWT, CRUD, filtres, pagination et bien d'autres fonctionnalités.

## ✅ État du Projet

- ✅ **Partie 1** : Routes Express avec fichier JSON
- ✅ **Partie 2** : Connexion MongoDB & Modèles Mongoose
- ✅ **Partie 3** : CRUD complet (CREATE, READ, UPDATE, DELETE)
- ✅ **Partie 4** : Filtres, tri et pagination
- ✅ **Partie 5** : Authentification JWT + Routes protégées
- ✅ **Partie 6** : Bonus (Favoris, Stats, Validation, Équipes)

---

## 🚀 Démarrage Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Importer les 151 Pokémon dans MongoDB Atlas
npm run seed

# 3. Lancer le serveur
npm run dev

# 4. Votre API est prête sur http://localhost:3000 🎉
```

---

## 📋 Hiérarchie du Projet

```
tp-nosql-mahdiwhb/
│
├── index.js                    ← Point d'entrée du serveur
├── package.json                ← Dépendances (Express, Mongoose, JWT, bcrypt)
├── .env                        ← Variables d'environnement (MongoDB URI, JWT_SECRET)
├── API_DOCUMENTATION.md        ← Documentation complète de l'API
│
├── models/                     ← Schémas Mongoose
│   ├── Pokemon.js              ← Schéma Pokémon (avec validation)
│   ├── User.js                 ← Schéma User (avec bcrypt pre-save)
│   └── Team.js                 ← Schéma Team (équipes de 6 max)
│
├── routes/                     ← Routes API
│   ├── pokemons.js             ← Pokémon (GET, POST, PUT, DELETE + filtres + stats)
│   ├── auth.js                 ← Authentification (register, login) + favoris
│   └── teams.js                ← Équipes Pokémon (CRUD complet)
│
├── middleware/                 ← Middlewares personnalisés
│   └── auth.js                 ← Vérification JWT pour routes protégées
│
├── db/                         ← Base de données
│   ├── connect.js              ← Connexion MongoDB
│   └── seed.js                 ← Import initial des données
│
└── data/                       ← Données
    ├── pokemons.json           ← 151 Pokémon (gen 1)
    └── importPokemons.js       ← Script d'import
```

---

## 🔑 Clés Technologiques Implémentées

| Technologie | Utilisation |
|-------------|------------|
| **Express.js** | Framework web |
| **MongoDB Atlas** | Base de données cloud |
| **Mongoose** | ORM pour MongoDB |
| **JWT** | Authentification tokens |
| **bcrypt** | Hashage des mots de passe |
| **nodemon** | Rechargement automatique en dev |
| **jq** | Formatage JSON (tests curl) |

---

## 📚 Les 6 Parties Expliquées

### Partie 1 : Premières Routes Express ✅

Routes simples pour servir les données des Pokémon :

```bash
GET /api/pokemons           # Tous les Pokémons (paginés)
GET /api/pokemons/25        # Pikachu spécifiquement
```

---

### Partie 2 : Connexion MongoDB & Modèles ✅

Utilisation de **MongoDB Atlas** (cloud gratuit) avec Mongoose :

```javascript
// Connexion automatique au démarrage
await connectDB();

// Modèles avec validation
- Pokemon : id unique, types validés, stats entre 1-255
- User : username unique, password hashé avec bcrypt
- Team : équipes de max 6 Pokémon, références vers User
```

---

### Partie 3 : CRUD Complet ✅

Opérations complètes sur les Pokémon :

```bash
GET    /api/pokemons/:id      # Lire
POST   /api/pokemons          # Créer (auth requise)
PUT    /api/pokemons/:id      # Modifier (auth requise)
DELETE /api/pokemons/:id      # Supprimer (auth requise)
```

---

### Partie 4 : Filtres, Tri, Pagination ✅

Paramètres de requête avancés :

```bash
# Filtrer par type
GET /api/pokemons?type=Fire

# Rechercher par nom (insensible à la casse)
GET /api/pokemons?name=pika
→ Retourne Pikachu, Pickachu shiny, etc.

# Trier
GET /api/pokemons?sort=name.french      # A→Z
GET /api/pokemons?sort=-base.Attack     # Top attaque

# Paginer
GET /api/pokemons?page=2&limit=20

# Combiner
GET /api/pokemons?type=Fire&sort=-base.Attack&page=1&limit=10
```

Réponse avec métadonnées :
```json
{
  "data": [...151 Pokémon...],
  "page": 1,
  "limit": 50,
  "total": 151,
  "totalPages": 4
}
```

---

### Partie 5 : Authentification JWT ✅

Système d'authentification sécurisé :

```bash
# Inscription
POST /api/auth/register
Body: { "username": "sacha", "password": "pikachu123" }

# Connexion
POST /api/auth/login
Body: { "username": "sacha", "password": "pikachu123" }
Réponse: { "token": "eyJhbGciOiJIUzI1NiI..." }

# Utiliser le token (headers)
Authorization: Bearer eyJhbGciOiJIUzI1NiI...
```

Routes **protégées** (nécessitent JWT) :
- `POST /api/pokemons` — Créer Pokémon
- `PUT /api/pokemons/:id` — Modifier Pokémon
- `DELETE /api/pokemons/:id` — Supprimer Pokémon
- `GET /api/teams` — Lister mes équipes
- etc.

---

### Partie 6 : Bonus ✅

#### 6.A - Système de Favoris

```bash
POST /api/auth/favorites/25          # Ajouter Pikachu aux favoris
DELETE /api/auth/favorites/25        # Retirer des favoris
GET /api/auth/favorites              # [25, 6, 39, ...]
```

#### 6.B - Statistiques Avancées

```bash
GET /api/pokemons/stats/overview
→ {
    "totalPokemons": 151,
    "avgHP": 54.2,
    "avgAttack": 69.1,
    "maxAttack": 134,
    "maxHP": 255
  }

GET /api/pokemons/stats/by-type
→ [
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

#### 6.C - Validation Avancée

- **Types** : 18 types Pokémon validés (Normal, Fire, Water, etc.)
- **Stats** : Entre 1 et 255
- **Messages** : En français et détaillés
- **Exemple** : `"HP doit être entre 1 et 255"`

#### 6.D - Équipes Pokémon

```bash
POST /api/teams
Body: {
  "name": "Mon équipe",
  "pokemons": [25, 6, 39, 58, 65, 4]  # Max 6
}

GET /api/teams               # Lister mes équipes
GET /api/teams/:id           # Détail avec données complètes
PUT /api/teams/:id           # Modifier
DELETE /api/teams/:id        # Supprimer

# Détail retourne les données complètes des Pokémon :
{
  "_id": "...",
  "name": "Mon équipe",
  "pokemons": [25, 6, ...],
  "pokemonsData": [
    { id: 25, name: {...}, type: [...], base: {...} },
    { id: 6, name: {...}, ... },
    ...
  ]
}
```

---

## 🧪 Tests Rapides

### Tester la liste des Pokémons
```bash
curl http://localhost:3000/api/pokemons?limit=5
```

### Tester l'authentification
```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ash","password":"bulbasaur"}'

# Connexion (obtenez le token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ash","password":"bulbasaur"}'

# Utiliser le token
TOKEN="votre_token_ici"
curl -X POST http://localhost:3000/api/pokemons \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 999,
    "name": {"english":"Mew","french":"Mewtwo"},
    "type":["Psychic"],
    "base":{"HP":100,"Attack":100,"Defense":100,"Speed":100}
  }'
```

---

## 🔒 Sécurité

- ✅ **Mots de passe** : Hashés avec bcrypt (salé)
- ✅ **Tokens** : JWT avec expiration 24h
- ✅ **Validation** : Schémas Mongoose stricts
- ✅ **Routes protégées** : Middleware JWT sur POST/PUT/DELETE
- ✅ **Messages** : Erreurs claires en français

---

## 📝 Variables d'Environnement (.env)

```
PORT=3000
MONGODB_URI=mongodb+srv://wouhaibimahdi:Mahdi260504@cluster0.hcr7iyn.mongodb.net/?appName=Cluster0
API_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key-change-in-production-12345
```

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier Node.js
node --version

# Vérifier les dépendances
npm install

# Vérifier le .env
cat .env
```

### MongoDB ne se connecte pas
```bash
# Vérifier la connexion Atlas
# 1. Allez sur https://cloud.mongodb.com
# 2. Vérifiez que "Network Access" permet votre IP
# 3. Copiez la bonne chaîne de connexion
# 4. Mettez à jour .env
```

### Erreurs de validation Mongoose
```bash
# Erreur : "HP doit être entre 1 et 255"
# → Vérifiez que les stats sont valides (1-255)
```

---

## 📖 Documentation Complète

Voir [API_DOCUMENTATION.md](API_DOCUMENTATION.md) pour :
- Routes détaillées avec exemples
- Codes d'erreur HTTP
- Exemples curl complets
- Format des réponses JSON

---

## 🎯 Points clés du code

### Middleware JWT
```javascript
// middleware/auth.js
export default function auth(req, res, next) {
    const token = req.headers.authorization?.slice(7);
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Token invalide' });
    }
}

// Utilisation dans les routes
router.post('/', auth, async (req, res) => { ... });
```

### Validation Mongoose
```javascript
// models/Pokemon.js
type: {
    type: [String],
    enum: { 
        values: ['Fire', 'Water', ...],
        message: '{VALUE} est invalide'
    }
},
base: {
    HP: { 
        type: Number,
        min: [1, 'Min 1'],
        max: [255, 'Max 255']
    }
}
```

### Agrégation MongoDB
```javascript
// Statistiques par type
const stats = await Pokemon.aggregate([
    { $unwind: '$type' },
    { 
        $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgHP: { $avg: '$base.HP' }
        }
    },
    { $sort: { count: -1 } }
]);
```

---


---

## 📞 Support

Besoin d'aide ?
1. Vérifiez **API_DOCUMENTATION.md**
2. Regardez les **logs du serveur** (`npm run dev`)
3. Testez avec **curl** ou **Postman**
4. Vérifiez **MongoDB Compass** pour les données

---

## 📄 Licence

Projet pédagogique - Libre d'utilisation

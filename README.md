# ⚡ PokeTeam - Plateforme de Gestion Pokémon

**Application Full-Stack moderne** combinant une API RESTful puissante (Express.js + MongoDB) avec une interface web premium pour gérer vos Pokémon, créer des équipes et organiser votre Pokédex personnel.

---

## 🌟 Aperçu du Projet

PokeTeam est une plateforme web complète permettant aux utilisateurs de:
- 🔍 **Explorer** tous les 151 Pokémon de la 1ère génération
- ⭐ **Collectionner** leurs Pokémon favoris dans un Pokédex personnel
- 🎯 **Créer** des équipes stratégiques de 6 Pokémon maximum
- 📊 **Analyser** des statistiques avancées et comparer les types
- 🔐 **S'authentifier** avec un système sécurisé JWT + bcrypt

---

## 📸 Captures d'Écran

### Page d'Accueil - Pokédex

![Pokédex](./screenshots/pokedex.png)

### Mon Pokédex Personnel

![Mon Pokédex](./screenshots/favorites.png)

### Gestion d'Équipes

![Équipes](./screenshots/teams.png)

### Détail d'un Pokémon

![Détail Pokémon](./screenshots/detail.png) 
                

### Authentification

![Authentification](./screenshots/auth.png)

---

## 🎨 Fonctionnalités du Site Web

### 🔐 Système d'Authentification
- **Inscription** avec prénom, nom, username et password
- **Connexion** sécurisée avec JWT (durée 24h)
- **Affichage** du prénom de l'utilisateur dans le header
- **Déconnexion** avec suppression du token

### 📚 Onglet Pokédex (Vue Publique)
- **Liste complète** des 151 Pokémon avec pagination (20 par page)
- **Recherche** par nom (insensible à la casse)
- **Filtrage** par type (Fire, Water, Grass, Electric, etc.)
- **Tri** par nom (A→Z, Z→A), attaque, HP, vitesse
- **Statistiques globales** : Total, Moyenne HP/Attaque, Max Attaque
- **Cards animées** avec hover effects et transitions fluides
- **Modal détaillé** au clic : stats complètes + actions rapides

### ⭐ Onglet Mon Pokédex (Personnel)
- **Collection de favoris** personnalisée par utilisateur
- **Ajout rapide** depuis le modal de détail
- **Suppression** en un clic (toggle dynamique)
- **Affichage en grille** identique au Pokédex principal
- **Message** si aucun favori

### 🎯 Onglet Mes Équipes
- **Création d'équipes** avec nom personnalisé
- **Maximum 6 Pokémon** par équipe (validation backend)
- **Modification** des équipes existantes
- **Suppression** avec confirmation
- **Affichage détaillé** de chaque Pokémon dans l'équipe
- **Retrait** d'un Pokémon de l'équipe
- **Cards d'équipes** avec animations et effets de glow

### 🚀 Actions Rapides (Modal Pokémon)
Depuis le modal de détail d'un Pokémon:
1. **Ajouter/Retirer des Favoris** (bouton dynamique avec changement de couleur)
2. **Ajouter à une équipe existante** (sélection d'équipe)
3. **Créer une nouvelle équipe** avec ce Pokémon

---

## 🎨 Design Premium

### Palette de Couleurs
- **Primary (Cyan)**: `#00D9FF` - Éléments principaux et highlights
- **Secondary (Purple)**: `#A742E4` - Accents et dégradés
- **Accent (Pink)**: `#FF6B9D` - Boutons d'action critiques
- **Background Dark**: `#0A0E27` - Fond principal
- **Card Background**: `#1a1f3a` - Cartes et modals

### Effets Visuels
- ✨ **Animations fluides** avec cubic-bezier pour tous les hovers
- 🌟 **Glow effects** sur les cartes au survol
- 💫 **Floating animation** sur le logo
- 🎭 **Backdrop blur** sur les modals et cartes
- 🌈 **Dégradés dynamiques** sur les boutons
- 📐 **Border glow** avec couleurs cyan/purple
- 🔄 **Transitions** de 0.4s pour toutes les interactions

### Typographie
- **Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Uppercase, letter-spacing, font-weight 800
- **Labels**: Uppercase, cyan color, bold

---

## ✅ Conformité au TP (6 Parties)

### Partie 1 : Routes Express ✅
- Routes API RESTful complètes
- Serveur Express avec middleware
- Gestion des erreurs HTTP

### Partie 2 : MongoDB & Mongoose ✅
- Connexion MongoDB Atlas
- 3 Modèles: Pokemon, User, Team
- Schémas avec validation

### Partie 3 : CRUD Complet ✅
- CREATE: Pokémon, User, Team
- READ: Avec filtres et pagination
- UPDATE: Modification complète
- DELETE: Suppression sécurisée

### Partie 4 : Filtres, Tri, Pagination ✅
- **Filtres**: Type, Nom (regex)
- **Tri**: Nom, Stats (ASC/DESC)
- **Pagination**: Page, Limit, TotalPages
- **Métadonnées**: page, limit, total, totalPages

### Partie 5 : Authentification JWT ✅
- Registration avec bcrypt (hashage)
- Login avec génération token JWT
- Middleware auth pour routes protégées
- Token stocké en localStorage (frontend)

### Partie 6 : Bonus ✅
- **6.A Favoris**: POST/DELETE/GET /api/auth/favorites/:id
- **6.B Stats**: Agrégation MongoDB (overview, by-type)
- **6.C Validation**: Types validés, stats 1-255, messages français
- **6.D Équipes**: CRUD complet avec max 6 Pokémon
- **+ Interface Web Premium** (non demandé mais ajouté)

---

## 🚀 Installation et Démarrage

### Prérequis
- Node.js >= 14.x
- MongoDB Atlas account (gratuit)
- npm ou yarn

### Étape 1: Cloner et Installer
```bash
# Cloner le projet
cd tp-nosql-mahdiwhb

# Installer les dépendances
npm install
```

### Étape 2: Configuration
Créer un fichier `.env` à la racine:
```env
PORT=3000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0
API_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
```

### Étape 3: Importer les Données
```bash
# Importer les 151 Pokémon dans MongoDB
npm run seed
```

### Étape 4: Lancer l'Application
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

### Étape 5: Accéder à l'Application
- **Site Web**: http://localhost:3000
- **API**: http://localhost:3000/api/pokemons

---

## 📁 Structure du Projet

```
tp-nosql-mahdiwhb/
│
├── index.js                    # Point d'entrée du serveur Express
├── package.json                # Dépendances (Express, Mongoose, JWT, bcrypt)
├── .env                        # Variables d'environnement (à créer)
├── API_DOCUMENTATION.md        # Documentation complète de l'API REST
├── MONGODB_SETUP.md            # Guide configuration MongoDB Atlas
├── SETUP.md                    # Guide setup général
│
├── public/                     # Frontend (SPA Vanilla JS)
│   └── index.html              # Application web complète (2000+ lignes)
│
├── models/                     # Schémas Mongoose
│   ├── Pokemon.js              # Schéma Pokémon (validation types, stats)
│   ├── User.js                 # Schéma User (bcrypt pre-save, favorites)
│   └── Team.js                 # Schéma Team (max 6 Pokémon, validation)
│
├── routes/                     # Routes API Express
│   ├── pokemons.js             # CRUD Pokémon + filtres + stats
│   ├── auth.js                 # Register, Login, Favoris
│   └── teams.js                # CRUD Équipes
│
├── middleware/                 # Middlewares personnalisés
│   └── auth.js                 # Vérification JWT
│
├── db/                         # Base de données
│   └── connect.js              # Connexion MongoDB Atlas
│
├── data/                       # Données
│   ├── pokemons.json           # 151 Pokémon (génération 1)
│   ├── pokemonsList.js         # Liste exportée
│   ├── generatePokemonsJson.js # Générateur JSON
│   └── importPokemons.js       # Script d'import MongoDB
│
└── assets/                     # Ressources statiques
    ├── pokemons/               # Images Pokémon (1.png à 151.png)
    │   └── shiny/              # Versions shiny
    └── types/                  # Icônes de types
```

---

## 🔌 API REST - Endpoints Principaux

### 🔐 Authentification
```bash
POST   /api/auth/register        # Inscription (username, password, firstName, lastName)
POST   /api/auth/login           # Connexion (retourne JWT token)
GET    /api/auth/me              # Infos utilisateur connecté (protégé)
```

### ⭐ Favoris (Routes Protégées)
```bash
GET    /api/auth/favorites       # Liste IDs favoris
POST   /api/auth/favorites/:id   # Ajouter aux favoris
DELETE /api/auth/favorites/:id   # Retirer des favoris
```

### 📚 Pokémon
```bash
GET    /api/pokemons             # Liste avec filtres/tri/pagination
GET    /api/pokemons/:id         # Détail d'un Pokémon
POST   /api/pokemons             # Créer (protégé)
PUT    /api/pokemons/:id         # Modifier (protégé)
DELETE /api/pokemons/:id         # Supprimer (protégé)
```

### 📊 Statistiques
```bash
GET    /api/pokemons/stats/overview    # Stats globales
GET    /api/pokemons/stats/by-type     # Stats par type
```

### 🎯 Équipes (Routes Protégées)
```bash
GET    /api/teams                # Mes équipes
GET    /api/teams/:id            # Détail équipe avec Pokémon complets
POST   /api/teams                # Créer équipe (max 6 Pokémon)
PUT    /api/teams/:id            # Modifier équipe
DELETE /api/teams/:id            # Supprimer équipe
```

---

## 🧪 Exemples d'Utilisation API

### Inscription et Connexion
```bash
# 1. Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "sacha",
    "password": "pikachu123",
    "firstName": "Sacha",
    "lastName": "Ketchum"
  }'

# 2. Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sacha","password":"pikachu123"}'

# Réponse contient le token:
# {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### Récupérer les Pokémon avec Filtres
```bash
# Tous les Pokémon type Fire, triés par attaque, page 1
curl "http://localhost:3000/api/pokemons?type=Fire&sort=-base.Attack&page=1&limit=10"

# Rechercher "Pika"
curl "http://localhost:3000/api/pokemons?name=pika"

# Pokémon 25 (Pikachu)
curl "http://localhost:3000/api/pokemons/25"
```

### Gérer les Favoris
```bash
# Obtenir le token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Ajouter Pikachu (#25) aux favoris
curl -X POST http://localhost:3000/api/auth/favorites/25 \
  -H "Authorization: Bearer $TOKEN"

# Lister mes favoris
curl http://localhost:3000/api/auth/favorites \
  -H "Authorization: Bearer $TOKEN"

# Retirer des favoris
curl -X DELETE http://localhost:3000/api/auth/favorites/25 \
  -H "Authorization: Bearer $TOKEN"
```

### Créer une Équipe
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/teams \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Fire",
    "pokemons": [4, 5, 6, 37, 38, 59]
  }'
```

### Créer un Pokémon Custom
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/pokemons \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 152,
    "name": {
      "english": "Chikorita",
      "french": "Germignon",
      "japanese": "チコリータ"
    },
    "type": ["Grass"],
    "base": {
      "HP": 45,
      "Attack": 49,
      "Defense": 65,
      "Speed": 45
    }
  }'
```

---

## 🛠️ Technologies Utilisées

### Backend
| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Node.js** | 18.x | Runtime JavaScript |
| **Express.js** | 4.18.x | Framework web |
| **MongoDB** | 6.x | Base de données NoSQL |
| **Mongoose** | 8.x | ODM pour MongoDB |
| **JWT** | 9.x | Authentification par tokens |
| **bcrypt** | 5.x | Hashage des mots de passe |
| **dotenv** | 16.x | Variables d'environnement |
| **nodemon** | 3.x | Rechargement automatique (dev) |

### Frontend
| Technologie | Utilisation |
|-------------|-------------|
| **Vanilla JavaScript** | SPA moderne sans framework |
| **Fetch API** | Requêtes HTTP asynchrones |
| **LocalStorage** | Persistance du token JWT |
| **CSS3** | Animations, gradients, backdrop-filter |
| **HTML5** | Structure sémantique |

---

## 🔒 Sécurité Implémentée

- ✅ **Mots de passe hashés** avec bcrypt (salting automatique)
- ✅ **JWT tokens** avec expiration 24h
- ✅ **Routes protégées** via middleware d'authentification
- ✅ **Validation stricte** des données (Mongoose schemas)
- ✅ **Messages d'erreur** clairs sans fuite d'info sensible
- ✅ **Pas de .env** dans Git (ajouté au .gitignore)
- ✅ **CORS configuré** pour autoriser le frontend

---

## 📊 Base de Données MongoDB

### Collections
1. **pokemons** (151 documents)
   - id: Number unique
   - name: {english, french, japanese}
   - type: Array de strings
   - base: {HP, Attack, Defense, Speed, SpAttack, SpDefense}

2. **users**
   - username: String unique
   - password: String hashé
   - firstName, lastName: String
   - favorites: Array d'IDs Pokémon
   - createdAt: Date

3. **teams**
   - name: String
   - user: ObjectId (référence User)
   - pokemons: Array d'IDs (max 6)
   - createdAt, updatedAt: Date

### Indexes
- Pokemon: `{ id: 1 }` unique
- User: `{ username: 1 }` unique
- Team: `{ user: 1 }`

---

## 🎯 Points Techniques Clés

### Middleware d'Authentification
```javascript
// middleware/auth.js
export default function auth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
}
```

### Validation Mongoose Avancée
```javascript
// models/Pokemon.js
const pokemonSchema = new mongoose.Schema({
    type: {
        type: [String],
        enum: {
            values: ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 
                     'Psychic', 'Poison', 'Flying', 'Ground', 'Rock', 
                     'Bug', 'Ghost', 'Ice', 'Dragon', 'Dark', 'Steel', 
                     'Fairy', 'Fighting'],
            message: 'Type {VALUE} invalide'
        },
        required: [true, 'Au moins un type requis']
    },
    base: {
        HP: { 
            type: Number, 
            min: [1, 'HP minimum: 1'], 
            max: [255, 'HP maximum: 255'] 
        }
    }
});
```

### Agrégation MongoDB (Stats)
```javascript
// routes/pokemons.js
const stats = await Pokemon.aggregate([
    { $unwind: '$type' },
    {
        $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgHP: { $avg: '$base.HP' },
            avgAttack: { $avg: '$base.Attack' }
        }
    },
    { $sort: { count: -1 } }
]);
```

### Frontend: Gestion Token JWT
```javascript
// public/index.html
let token = localStorage.getItem('token');

// Après login
async function handleLogin(event) {
    event.preventDefault();
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    token = data.token;
}

// Requêtes authentifiées
fetch(`${API_URL}/teams`, {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🧪 Tests et Validation

### Test Manuel Complet
1. **Inscription/Connexion**
   - Créer un compte
   - Se connecter
   - Vérifier que le prénom s'affiche

2. **Pokédex**
   - Tester la recherche par nom
   - Filtrer par type
   - Trier par stats
   - Naviguer entre les pages

3. **Favoris**
   - Cliquer sur un Pokémon
   - Ajouter aux favoris
   - Vérifier dans "Mon Pokédex"
   - Retirer des favoris

4. **Équipes**
   - Créer une équipe avec 6 Pokémon
   - Modifier une équipe
   - Supprimer un Pokémon de l'équipe
   - Supprimer une équipe

### Validation des Contraintes
- ✅ Maximum 6 Pokémon par équipe (erreur sinon)
- ✅ Pas de doublon dans une équipe (validation frontend)
- ✅ Token expiré → déconnexion automatique
- ✅ Stats entre 1-255 (validation Mongoose)

---

## 📖 Documentation Complémentaire

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Documentation API complète avec tous les endpoints
- **[MONGODB_SETUP.md](MONGODB_SETUP.md)** - Guide configuration MongoDB Atlas
- **[SETUP.md](SETUP.md)** - Guide d'installation détaillé

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier Node.js
node --version  # Doit être >= 14

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Vérifier .env
cat .env  # Vérifier MONGODB_URI et JWT_SECRET
```

### MongoDB ne se connecte pas
1. Vérifier la chaîne de connexion dans `.env`
2. Autoriser votre IP dans MongoDB Atlas → Network Access
3. Vérifier que le cluster est actif
4. Tester avec MongoDB Compass

### Frontend ne charge pas
```bash
# Vérifier que le serveur est lancé
curl http://localhost:3000

# Ouvrir la console navigateur (F12) pour voir les erreurs
# Vérifier les logs serveur
```

### Erreurs JWT
- **Token invalide** → Déconnexion puis reconnexion
- **Token expiré** → Se reconnecter (durée: 24h)
- **Token manquant** → Vérifier localStorage dans DevTools

---

## 🎓 Concepts Pédagogiques Démontrés

### Architecture MVC
- **Models**: Mongoose schemas avec validation
- **Views**: Frontend HTML/CSS/JS (SPA)
- **Controllers**: Routes Express (handlers)

### Patterns Utilisés
- **Middleware Pattern**: auth, error handling
- **Repository Pattern**: Models Mongoose
- **RESTful API**: Conventions HTTP standards
- **JWT Authentication**: Stateless auth
- **Hashing**: bcrypt pour sécurité

### Compétences MongoDB
- CRUD opérations
- Indexing (unique constraints)
- Aggregation pipeline
- $unwind, $group, $sort
- References (ObjectId)
- Validation schemas

---

## 📈 Améliorations Futures Possibles

- [ ] **Battles Pokémon** - Simulation de combats
- [ ] **Trading** - Échanger des Pokémon entre utilisateurs
- [ ] **Évolutions** - Gérer les évolutions de Pokémon
- [ ] **Génération 2-9** - Ajouter plus de Pokémon
- [ ] **Upload d'images** - Pokémon customs avec images
- [ ] **Système de niveaux** - XP et progression
- [ ] **Modes de jeu** - Challenges et quêtes
- [ ] **Classements** - Leaderboards
- [ ] **Mode sombre/clair** - Toggle theme
- [ ] **Responsive mobile** - Optimisation mobile
- [ ] **Tests automatisés** - Jest/Mocha/Chai
- [ ] **CI/CD** - GitHub Actions
- [ ] **Déploiement** - Heroku/Vercel/Railway

---

## 👨‍💻 Auteur

**Projet réalisé dans le cadre du TP NoSQL**
- Backend API RESTful: Express.js + MongoDB
- Frontend: Vanilla JavaScript avec design moderne
- Toutes les 6 parties du TP complétées
- Bonus: Interface web premium non demandée

---

## 📄 Licence

Projet pédagogique - Libre d'utilisation pour l'apprentissage


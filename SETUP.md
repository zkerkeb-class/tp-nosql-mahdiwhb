# 🚀 Guide de Démarrage Complet

Suivez ce guide étape par étape pour mettre en place et tester complètement votre API Pokémon.

---

## 📋 Checklist de Configuration

- [ ] Node.js installé (v18+)
- [ ] MongoDB Atlas accessible
- [ ] npm install exécuté
- [ ] .env configuré
- [ ] npm run seed exécuté
- [ ] npm run dev démarré
- [ ] Requêtes testées avec curl/Postman

---

## ⚙️ Installation Initiale (Première fois)

### Étape 1 : Vérifier les prérequis

```bash
# Vérifier Node.js
node --version      # Doit être v18 ou supérieur
npm --version       # Doit être v9 ou supérieur
```

### Étape 2 : Installer les dépendances

```bash
cd /Users/mahdi/Downloads/projet\ pokemon/tp-nosql-mahdiwhb
npm install
```

Vous devriez avoir ces packages :
- express
- cors
- mongoose
- bcrypt
- jsonwebtoken
- dotenv
- nodemon

### Étape 3 : Vérifier le fichier .env

Le fichier `.env` doit exister avec ces variables :

```
PORT=3000
MONGODB_URI=mongodb+srv://wouhaibimahdi:Mahdi260504@cluster0.hcr7iyn.mongodb.net/?appName=Cluster0
API_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key-change-in-production-12345
```

**Si le fichier n'existe pas :**
```bash
cp .env.example .env
# Puis éditez avec votre URI MongoDB
```

### Étape 4 : Importer les 151 Pokémons

```bash
npm run seed
```

Résultat attendu :
```
✅ Connecté à MongoDB
🗑️  Base de données nettoyée
✅ 151 Pokémons importés avec succès !
👋 Connexion fermée
```

---

## 🎮 Démarrer le Serveur

```bash
npm run dev
```

Résultat attendu :
```
✅ Connecté à MongoDB !
Server is running on http://localhost:3000
```

---

## 🧪 Tester l'API

### Option 1 : Avec cURL (Ligne de commande)

#### Tester une route publique
```bash
curl http://localhost:3000/api/pokemons/25
```

#### Créer un utilisateur
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ash","password":"bulbasaur123"}'
```

#### Se connecter (obtenir le token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ash","password":"bulbasaur123"}' | jq .token
```

#### Utiliser le token pour une route protégée
```bash
TOKEN="votre_token_ici"
curl -X GET http://localhost:3000/api/teams \
  -H "Authorization: Bearer $TOKEN"
```

---

### Option 2 : Avec Postman (Graphique)

#### Installer Postman
1. Allez sur https://www.postman.com/downloads/
2. Téléchargez et installez

#### Importer la collection
1. Ouvrez Postman
2. Cliquez sur **Import** (en haut à gauche)
3. Sélectionnez **Pokemon_API.postman_collection.json**
4. Voilà ! Vous avez accès à toutes les requêtes

#### Configurer l'environnement
1. Dans Postman, cliquez sur l'œil (🔍) en haut à droite
2. Créez une variable `token` 
3. Après chaque login, copiez le token dans cette variable
4. Les requêtes utilisant ``{{token}}`` récupèreront automatiquement

---

### Option 3 : Avec Thunder Client (VS Code)

#### Installer l'extension
1. Ouvrez VS Code
2. Allez à **Extensions**
3. Cherchez **Thunder Client**
4. Cliquez **Install**

#### Importer la collection
1. Ouvrez Thunder Client (icône en barre latérale)
2. Cliquez sur **Collections**
3. Cliquez sur **Import** (icône dossier)
4. Sélectionnez **Pokemon_API.postman_collection.json**

#### Utiliser
- Cliquez sur chaque requête pour la voir
- Modifiez les valeurs si besoin
- Cliquez **Send** pour tester

---

## 🧑‍💻 Workflow Complet Exemple

### Scénario : Créer une équipe Pokémon

#### Étape 1 : Inscription
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "trainer_1",
    "password": "SecurePass123"
  }'
```

Réponse :
```json
{
  "message": "Utilisateur créé avec succès",
  "username": "trainer_1"
}
```

#### Étape 2 : Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "trainer_1",
    "password": "SecurePass123"
  }'
```

Réponse :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copiez ce token !**

#### Étape 3 : Créer une équipe
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Mon équipe de légende",
    "pokemons": [25, 6, 39, 58, 65, 4]
  }'
```

Réponse :
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "...",
  "name": "Mon équipe de légende",
  "pokemons": [25, 6, 39, 58, 65, 4],
  "createdAt": "2026-02-16T15:30:00.000Z"
}
```

**Copiez l'_id !**

#### Étape 4 : Voir les détails de l'équipe
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
TEAM_ID="507f1f77bcf86cd799439011"

curl -X GET http://localhost:3000/api/teams/$TEAM_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Vous verrez les données complètes des 6 Pokémons !

#### Étape 5 : Ajouter un favori
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/auth/favorites/25 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Tester les Filtres

### Filtrer par type
```bash
curl "http://localhost:3000/api/pokemons?type=Fire&limit=5"
```

### Rechercher par nom
```bash
curl "http://localhost:3000/api/pokemons?name=char&limit=10"
```

### Trier par attaque décroissante
```bash
curl "http://localhost:3000/api/pokemons?sort=-base.Attack&limit=5"
```

### Pagination
```bash
curl "http://localhost:3000/api/pokemons?page=2&limit=20"
```

### Combiner tous les filtres
```bash
curl "http://localhost:3000/api/pokemons?type=Water&sort=-base.HP&page=1&limit=5"
```

---

## 📊 Voir les Statistiques

```bash
# Statistiques globales
curl http://localhost:3000/api/pokemons/stats/overview | jq .

# Statistiques par type
curl http://localhost:3000/api/pokemons/stats/by-type | jq .
```

---

## 🔗 Vérifier les Données dans MongoDB Compass

### Télécharger et installer
1. Allez sur https://www.mongodb.com/try/download/compass
2. Installez l'application

### Se connecter
1. Ouvrez MongoDB Compass
2. Dans le champ **URI**, collez :
```
mongodb+srv://wouhaibimahdi:Mahdi260504@cluster0.hcr7iyn.mongodb.net
```
3. Cliquez **Connect**

### Voir vos données
1. Cliquez sur la base **pokemons**
2. Cliquez sur la collection **pokemons** ou **users** ou **teams**
3. Vous voyez tous les documents en temps réel !

---

## ❌ Dépannage

### Erreur : "Cannot find package 'express'"
```bash
# Solution : installer les dépendances
npm install
```

### Erreur : "Connection refused - MongoDB"
```bash
# Solutions :
# 1. Vérifier que MONGODB_URI est correct dans .env
# 2. Vérifier que MongoDB Atlas Network Access accepte votre IP
#    (https://cloud.mongodb.com → Network Access → Add IP Address)
# 3. Vérifier que l'internet fonctionne
```

### Erreur : "Token invalide" (401)
```bash
# Solutions :
# 1. Vérifier que le header Authorization est présent
# 2. Vérifier que le format est "Bearer <token>"
# 3. Vérifier que le token n'est pas expiré (24h)
# 4. Se reconnecter pour obtenir un nouveau token
```

### Erreur : "Pokémon non trouvé" (404)
```bash
# Solutions :
# 1. Vérifier que l'ID existe (1-151 par défaut)
# 2. Vérifier que npm run seed a été exécuté
# 3. Vérifier dans MongoDB Compass que les données existent
```

### Le serveur ne redémarre pas
```bash
# Solution : tuer les processus Node.js
pkill -f "node index.js"
npm run dev
```

---

## 📚 Fichiers Importants

| Fichier | Rôle |
|---------|------|
| `index.js` | Point d'entrée du serveur |
| `.env` | Variables d'environnement |
| `models/` | Schémas Mongoose (Pokemon, User, Team) |
| `routes/` | Routes API (pokemons, auth, teams) |
| `middleware/auth.js` | Vérification JWT |
| `API_DOCUMENTATION.md` | Documentation complète |
| `Pokemon_API.postman_collection.json` | Collection Postman à importer |

---

## 🎯 Résumé des Commandes

```bash
# Démarrage
npm install              # Installer dépendances
npm run seed            # Importer 151 Pokémons
npm run dev             # Lancer le serveur

# Tests
curl http://localhost:3000/api/pokemons/25
curl http://localhost:3000/api/pokemons/stats/overview

# Arrêter
Ctrl+C (dans le terminal du serveur)
```

---

## ✅ Vous êtes prêt !

Votre API est maintenant **complètement fonctionnelle** et **production-ready**.

Des questions ? Consultez :
- **API_DOCUMENTATION.md** → Documentation complète
- **README.md** → Vue d'ensemble du projet
- **logs du serveur** → Messages d'erreur détaillés

**Bon développement ! 🚀**

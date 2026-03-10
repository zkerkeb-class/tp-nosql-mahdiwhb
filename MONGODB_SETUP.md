# Configuration MongoDB Compass

## 📦 Installation de MongoDB

### Sur macOS :
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

## 🔗 Configuration MongoDB Compass

### 1. Télécharger MongoDB Compass
- Téléchargez depuis : https://www.mongodb.com/try/download/compass
- Installez l'application

### 2. Connexion à MongoDB
1. Ouvrez MongoDB Compass
2. Dans le champ Connection String, entrez : 
   ```
   mongodb://localhost:27017
   ```
3. Cliquez sur "Connect"

### 3. Créer la base de données
1. Une fois connecté, cliquez sur "Create Database"
2. Database Name : `pokemons`
3. Collection Name : `pokemons`
4. Cliquez sur "Create Database"

## 🚀 Utilisation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Importer les données Pokémon dans MongoDB
```bash
npm run import
```

### 3. Démarrer le serveur
```bash
npm run dev
```

### 4. Tester l'API
- Tous les Pokémons : http://localhost:3000/api/pokemons
- Un Pokémon spécifique : http://localhost:3000/api/pokemons/1

## 🔍 Visualiser vos données dans MongoDB Compass

1. Ouvrez MongoDB Compass
2. Connectez-vous à `mongodb://localhost:27017`
3. Cliquez sur la base de données `pokemons`
4. Cliquez sur la collection `pokemons`
5. Vous verrez tous vos Pokémons !

## 📂 Structure de la base de données

Chaque document Pokémon contient :
- `id` : Identifiant unique
- `name` : Nom dans différentes langues (anglais, japonais, chinois, français)
- `type` : Types du Pokémon (ex: ["Grass", "Poison"])
- `base` : Statistiques de base (HP, Attack, Defense, etc.)
- `image` : URL de l'image

## 🛠️ Requêtes utiles dans MongoDB Compass

### Rechercher un Pokémon par nom
```json
{ "name.french": "Bulbizarre" }
```

### Rechercher par type
```json
{ "type": "Fire" }
```

### Rechercher les Pokémons avec HP > 100
```json
{ "base.HP": { "$gt": 100 } }
```

## ⚡ Routes API disponibles

- `GET /api/pokemons` - Récupérer tous les Pokémons
- `GET /api/pokemons/:id` - Récupérer un Pokémon par ID
- `POST /api/pokemons` - Ajouter un nouveau Pokémon

## 🐛 Dépannage

### MongoDB ne démarre pas ?
```bash
# Vérifier le statut
brew services list

# Redémarrer MongoDB
brew services restart mongodb-community
```

### Erreur de connexion ?
- Vérifiez que MongoDB est bien démarré
- Vérifiez la valeur de `MONGODB_URI` dans votre fichier `.env`
- Assurez-vous que MongoDB Compass est bien connecté à `mongodb://localhost:27017`

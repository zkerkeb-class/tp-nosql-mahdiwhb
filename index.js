/**
 * ════════════════════════════════════════════════════════════════════════════
 *                          POKETEAM - SERVER PRINCIPAL
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Application Express.js + MongoDB pour la gestion de Pokémon
 * 
 * Fonctionnalités:
 * - API RESTful complète (CRUD Pokémon, Équipes, Favoris)
 * - Authentification JWT sécurisée
 * - Interface Web moderne
 * - Pagination, Filtres et Tri avancés
 * - Statistiques et agrégations MongoDB
 * 
 * @author Mahdi
 * @version 1.0.0
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// IMPORTS
// ════════════════════════════════════════════════════════════════════════════

// Variables d'environnement (doit être chargé en PREMIER)
import 'dotenv/config';

// Framework et middlewares
import express from 'express';
import cors from 'cors';

// Base de données
import connectDB from './db/connect.js';

// Routes API
import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js';
import teamsRouter from './routes/teams.js';

// ════════════════════════════════════════════════════════════════════════════
// CONNEXION BASE DE DONNÉES
// ════════════════════════════════════════════════════════════════════════════

// Connexion à MongoDB AVANT de lancer le serveur
await connectDB();

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURATION EXPRESS
// ════════════════════════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 3000;

// ════════════════════════════════════════════════════════════════════════════
// MIDDLEWARES
// ════════════════════════════════════════════════════════════════════════════

app.use(cors());                                // Autoriser les requêtes cross-origin
app.use('/assets', express.static('assets'));  // Servir les images Pokémon
app.use(express.static('public'));             // Servir l'interface web (index.html)
app.use(express.json());                       // Parser le JSON des requêtes

// ════════════════════════════════════════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════════════════════════════════════════

// Route racine
app.get('/', (req, res) => {
    res.send('🔥 PokeTeam API - Server is running! Access the web app at http://localhost:' + PORT);
});

// Routes API
app.use('/api/pokemons', pokemonsRouter);  // CRUD Pokémon + Filtres + Stats
app.use('/api/auth', authRouter);          // Authentification + Favoris
app.use('/api/teams', teamsRouter);        // CRUD Équipes

// ════════════════════════════════════════════════════════════════════════════
// DÉMARRAGE DU SERVEUR
// ════════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
    console.log('\n════════════════════════════════════════════════════════════════');
    console.log('  ⚡ PokeTeam Server Started Successfully!');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`  🌐 Web App:    http://localhost:${PORT}`);
    console.log(`  📡 API:        http://localhost:${PORT}/api/pokemons`);
    console.log(`  📊 Database:   MongoDB Atlas`);
    console.log('════════════════════════════════════════════════════════════════\n');
});

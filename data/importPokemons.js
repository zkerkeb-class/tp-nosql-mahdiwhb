import 'dotenv/config';
import mongoose from 'mongoose';
import Pokemon from '../models/Pokemon.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connecté à MongoDB');
        
        // Lire le fichier pokemons.json
        const pokemonsData = JSON.parse(
            readFileSync(join(__dirname, 'pokemons.json'), 'utf-8')
        );
        
        // Supprimer toutes les données existantes
        await Pokemon.deleteMany({});
        console.log('🗑️  Base de données nettoyée');
        
        // Insérer les nouveaux Pokémons
        await Pokemon.insertMany(pokemonsData);
        console.log(`✅ ${pokemonsData.length} Pokémons importés avec succès !`);
        
        // Fermer la connexion
        await mongoose.connection.close();
        console.log('👋 Connexion fermée');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Erreur:', error);
        process.exit(1);
    });

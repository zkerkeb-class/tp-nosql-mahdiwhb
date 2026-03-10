/**
 * ════════════════════════════════════════════════════════════════════════════
 *                      CONNEXION BASE DE DONNÉES MONGODB
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Fonction de connexion à MongoDB Atlas via Mongoose
 * 
 * Fonctionnalités:
 * - Connexion asynchrone à MongoDB Atlas
 * - Utilisation de la variable d'environnement MONGODB_URI
 * - Gestion des erreurs avec sortie du processus en cas d'échec
 * - Messages console colorés pour feedback visuel
 * 
 * Configuration requise:
 * - Fichier .env avec MONGODB_URI=mongodb+srv://...
 * 
 * Partie 2 - Base de données NoSQL avec MongoDB
 * ════════════════════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';

/**
 * Établit la connexion à MongoDB Atlas
 * 
 * Utilise mongoose.connect() avec l'URI de connexion
 * En cas d'erreur, affiche le message et termine le processus (exit 1)
 * 
 * @async
 * @throws {Error} Si la connexion échoue
 */
export default async function connectDB() {
    try {
        // ────────────────────────────────────────────────────────────────────
        // CONNEXION MONGODB ATLAS
        // ────────────────────────────────────────────────────────────────────
        // L'URI est chargée depuis .env via dotenv (index.js)
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ Connecté à MongoDB !');
    } catch (error) {
        // ────────────────────────────────────────────────────────────────────
        // GESTION DES ERREURS DE CONNEXION
        // ────────────────────────────────────────────────────────────────────
        // Affiche l'erreur et termine le processus
        // Exit code 1 = erreur (vs 0 = succès)
        console.error('❌ Erreur de connexion à MongoDB:', error.message);
        process.exit(1);
    }
}

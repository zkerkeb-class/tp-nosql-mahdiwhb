/**
 * ════════════════════════════════════════════════════════════════════════════
 *                            MODÈLE ÉQUIPE - MONGOOSE
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Schéma de données pour les équipes de Pokémon
 * 
 * Fonctionnalités:
 * - Limitation à 6 Pokémon maximum par équipe (règle officielle Pokémon)
 * - Liaison avec utilisateur (ObjectId)
 * - Stockage des IDs de Pokémon (référence vers collection Pokemon)
 * - Validation automatique via middleware pre-save
 * 
 * Collection MongoDB: "teams"
 * ════════════════════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';

// ════════════════════════════════════════════════════════════════════════════
// SCHÉMA MONGOOSE
// ════════════════════════════════════════════════════════════════════════════

const teamSchema = new mongoose.Schema({
    // ────────────────────────────────────────────────────────────────────────
    // PROPRIÉTAIRE DE L'ÉQUIPE
    // ────────────────────────────────────────────────────────────────────────
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // ────────────────────────────────────────────────────────────────────────
    // NOM DE L'ÉQUIPE
    // ────────────────────────────────────────────────────────────────────────
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    // ────────────────────────────────────────────────────────────────────────
    // POKÉMON DE L'ÉQUIPE (Max 6)
    // ────────────────────────────────────────────────────────────────────────
    pokemons: [
        {
            type: Number,      // ID du Pokémon (1-151)
            ref: 'Pokemon'     // Référence pour populate
        }
    ],
    
    // ────────────────────────────────────────────────────────────────────────
    // MÉTADONNÉES
    // ────────────────────────────────────────────────────────────────────────
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE PRE-SAVE - VALIDATION DE LA LIMITE DE 6 POKÉMON
// ════════════════════════════════════════════════════════════════════════════

/**
 * Vérifie qu'une équipe ne contient pas plus de 6 Pokémon
 * Lève une erreur si la limite est dépassée (bloque la sauvegarde)
 * 
 * Note: Utilise async/throw au lieu de callback next() pour éviter
 *       l'erreur "next is not a function" dans les environnements modernes
 */
teamSchema.pre('save', async function(next) {
    if (this.pokemons.length > 6) {
        throw new Error('Une équipe ne peut contenir que 6 Pokémon maximum');
    }
});

// ════════════════════════════════════════════════════════════════════════════
// EXPORT DU MODÈLE
// ════════════════════════════════════════════════════════════════════════════

const Team = mongoose.model('Team', teamSchema);

export default Team;

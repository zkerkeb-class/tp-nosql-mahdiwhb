/**
 * ════════════════════════════════════════════════════════════════════════════
 *                          MODÈLE POKÉMON - MONGOOSE
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Schéma de données pour les Pokémon avec validation complète
 * 
 * Fonctionnalités:
 * - Validation des 18 types Pokémon officiels
 * - Validation des stats (1-255)
 * - Support multilingue (anglais, français, japonais, chinois)
 * - Messages d'erreur en français
 * - Timestamps automatiques (createdAt, updatedAt)
 * 
 * Collection MongoDB: "pokemons"
 * ════════════════════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Les 18 types officiels Pokémon
 * Utilisé pour la validation enum
 */
const POKEMON_TYPES = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 
    'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

// ════════════════════════════════════════════════════════════════════════════
// SCHÉMA MONGOOSE
// ════════════════════════════════════════════════════════════════════════════

const pokemonSchema = new mongoose.Schema({
    // ────────────────────────────────────────────────────────────────────────
    // ID UNIQUE
    // ────────────────────────────────────────────────────────────────────────
    id: {
        type: Number,
        required: [true, 'L\'ID est requis'],
        unique: true,
        min: [1, 'L\'ID doit être positif']
    },

    // ────────────────────────────────────────────────────────────────────────
    // NOMS (MULTILINGUE)
    // ────────────────────────────────────────────────────────────────────────
    name: {
        english: {
            type: String,
            required: [true, 'Le nom anglais est requis']
        },
        japanese: String,
        chinese: String,
        french: {
            type: String,
            required: [true, 'Le nom français est requis']
        }
    },

    // ────────────────────────────────────────────────────────────────────────
    // TYPES (1 ou 2 types possibles)
    // ────────────────────────────────────────────────────────────────────────
    type: {
        type: [String],
        required: [true, 'Au moins un type est requis'],
        enum: {
            values: POKEMON_TYPES,
            message: '{VALUE} n\'est pas un type valide. Types autorisés: ' + POKEMON_TYPES.join(', ')
        }
    },

    // ────────────────────────────────────────────────────────────────────────
    // STATISTIQUES DE BASE (1-255)
    // ────────────────────────────────────────────────────────────────────────
    base: {
        HP: {
            type: Number,
            required: [true, 'HP requis'],
            min: [1, 'HP doit être entre 1 et 255'],
            max: [255, 'HP doit être entre 1 et 255']
        },
        Attack: {
            type: Number,
            required: [true, 'Attack requis'],
            min: [1, 'Attack doit être entre 1 et 255'],
            max: [255, 'Attack doit être entre 1 et 255']
        },
        Defense: {
            type: Number,
            required: [true, 'Defense requis'],
            min: [1, 'Defense doit être entre 1 et 255'],
            max: [255, 'Defense doit être entre 1 et 255']
        },
        SpecialAttack: {
            type: Number,
            min: [1, 'SpecialAttack doit être entre 1 et 255'],
            max: [255, 'SpecialAttack doit être entre 1 et 255']
        },
        SpecialDefense: {
            type: Number,
            min: [1, 'SpecialDefense doit être entre 1 et 255'],
            max: [255, 'SpecialDefense doit être entre 1 et 255']
        },
        Speed: {
            type: Number,
            min: [1, 'Speed doit être entre 1 et 255'],
            max: [255, 'Speed doit être entre 1 et 255']
        }
    },

    // ────────────────────────────────────────────────────────────────────────
    // IMAGE (optionnelle)
    // ────────────────────────────────────────────────────────────────────────
    image: String

}, {
    // Options du schéma
    timestamps: true  // Ajoute automatiquement createdAt et updatedAt
});

// ════════════════════════════════════════════════════════════════════════════
// EXPORT DU MODÈLE
// ════════════════════════════════════════════════════════════════════════════

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;

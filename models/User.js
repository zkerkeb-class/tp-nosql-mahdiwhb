/**
 * ════════════════════════════════════════════════════════════════════════════
 *                          MODÈLE UTILISATEUR - MONGOOSE
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Schéma de données pour les utilisateurs avec authentification sécurisée
 * 
 * Fonctionnalités:
 * - Hashage automatique du mot de passe (bcrypt avec salt)
 * - Méthode de comparaison de mot de passe
 * - Gestion des favoris (IDs de Pokémon)
 * - Validation des champs (username unique, longueurs minimales)
 * 
 * Collection MongoDB: "users"
 * ════════════════════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// ════════════════════════════════════════════════════════════════════════════
// SCHÉMA MONGOOSE
// ════════════════════════════════════════════════════════════════════════════

const userSchema = new mongoose.Schema({
    // ────────────────────────────────────────────────────────────────────────
    // IDENTIFIANTS
    // ────────────────────────────────────────────────────────────────────────
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    
    // ────────────────────────────────────────────────────────────────────────
    // INFORMATIONS PERSONNELLES
    // ────────────────────────────────────────────────────────────────────────
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    
    // ────────────────────────────────────────────────────────────────────────
    // SÉCURITÉ
    // ────────────────────────────────────────────────────────────────────────
    password: {
        type: String,
        required: true,
        minlength: 6  // Sera hashé par le middleware pre-save
    },
    
    // ────────────────────────────────────────────────────────────────────────
    // POKÉMON FAVORIS (Partie 6.A)
    // ────────────────────────────────────────────────────────────────────────
    favorites: {
        type: [Number],  // Tableau d'IDs de Pokémon
        default: []
    },
    
    // ────────────────────────────────────────────────────────────────────────
    // MÉTADONNÉES
    // ────────────────────────────────────────────────────────────────────────
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE PRE-SAVE - HASHAGE DU MOT DE PASSE
// ════════════════════════════════════════════════════════════════════════════

/**
 * Hashe automatiquement le mot de passe avant sauvegarde
 * Utilise bcrypt avec 10 rounds de salting
 * Ne hashe que si le mot de passe est modifié (évite double hashage)
 */
userSchema.pre('save', async function() {
    // Ne hasher que si le mot de passe a été modifié
    if (!this.isModified('password')) return;
    
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    } catch (error) {
        throw new Error('Erreur lors du hashage du mot de passe');
    }
});

// ════════════════════════════════════════════════════════════════════════════
// MÉTHODES D'INSTANCE
// ════════════════════════════════════════════════════════════════════════════

/**
 * Compare un mot de passe en clair avec le hash stocké
 * @param {string} passwordToCompare - Mot de passe à vérifier
 * @returns {Promise<boolean>} - true si les mots de passe correspondent
 */
userSchema.methods.comparePassword = async function(passwordToCompare) {
    return bcrypt.compare(passwordToCompare, this.password);
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORT DU MODÈLE
// ════════════════════════════════════════════════════════════════════════════

const User = mongoose.model('User', userSchema);

export default User;

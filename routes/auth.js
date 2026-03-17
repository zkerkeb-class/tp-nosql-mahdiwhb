/**
 * ════════════════════════════════════════════════════════════════════════════
 *                    ROUTES AUTHENTIFICATION - API REST
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Gestion de l'authentification JWT et des favoris utilisateur
 * 
 * Fonctionnalités:
 * - Inscription avec hashage bcrypt automatique (Partie 5)
 * - Connexion avec génération de JWT (token 24h)
 * - Récupération des infos utilisateur (route protégée)
 * - Système de favoris (ajout, retrait, liste - Partie 6.A)
 * 
 * Base URL: /api/auth
 * ════════════════════════════════════════════════════════════════════════════
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ════════════════════════════════════════════════════════════════════════════
//                    ROUTES D'AUTHENTIFICATION (PUBLIQUES)
// ════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/auth/register
 * 
 * Inscription d'un nouvel utilisateur
 * Le mot de passe sera automatiquement hashé par le middleware pre-save
 * 
 * Body requis:
 * - username: Identifiant unique (min 3 caractères)
 * - password: Mot de passe (min 6 caractères)
 * - firstName: Prénom
 * - lastName: Nom
 * 
 * Partie 5 - Authentification JWT
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        
        // ────────────────────────────────────────────────────────────────────
        // VALIDATION DES CHAMPS REQUIS
        // ────────────────────────────────────────────────────────────────────
        if (!username || !password || !firstName || !lastName) {
            return res.status(400).json({ 
                error: 'Username, password, firstName et lastName requis' 
            });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // VÉRIFICATION DE L'UNICITÉ DU USERNAME
        // ────────────────────────────────────────────────────────────────────
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Cet utilisateur existe déjà' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // CRÉATION DE L'UTILISATEUR
        // ────────────────────────────────────────────────────────────────────
        // Le password sera automatiquement hashé par le middleware pre-save
        const user = new User({ username, password, firstName, lastName });
        await user.save();
        
        res.status(201).json({ 
            message: 'Utilisateur créé avec succès',
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * POST /api/auth/login
 * 
 * Connexion d'un utilisateur existant
 * Génère un token JWT valide 24 heures
 * 
 * Body requis:
 * - username: Identifiant
 * - password: Mot de passe
 * 
 * Retourne: Token JWT + infos utilisateur (sans password)
 * 
 * Partie 5 - Authentification JWT
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // ────────────────────────────────────────────────────────────────────
        // VALIDATION DES CHAMPS REQUIS
        // ────────────────────────────────────────────────────────────────────
        if (!username || !password) {
            return res.status(400).json({ error: 'Username et password requis' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // RECHERCHE DE L'UTILISATEUR
        // ────────────────────────────────────────────────────────────────────
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // VÉRIFICATION DU MOT DE PASSE
        // ────────────────────────────────────────────────────────────────────
        // Utilise la méthode comparePassword du modèle User (bcrypt.compare)
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // GÉNÉRATION DU TOKEN JWT
        // ────────────────────────────────────────────────────────────────────
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                firstName: user.firstName, 
                lastName: user.lastName 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }  // Token valide 24 heures
        );
        
        res.json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ════════════════════════════════════════════════════════════════════════════
//                     ROUTES UTILISATEUR (PROTÉGÉES)
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/auth/me
 * 
 * Récupère les informations de l'utilisateur connecté
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * Retourne: Objet User (sans le champ password)
 * 
 * Partie 5 - Authentification JWT
 */
router.get('/me', auth, async (req, res) => {
    try {
        // req.user.id est défini par le middleware auth
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ════════════════════════════════════════════════════════════════════════════
//                      ROUTES FAVORIS (PROTÉGÉES)
// ════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/auth/favorites/:pokemonId
 * 
 * Ajoute un Pokémon aux favoris de l'utilisateur
 * Utilise $addToSet pour éviter les doublons
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * 
 * Partie 6.A - Système de favoris
 */
router.post('/favorites/:pokemonId', auth, async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.pokemonId);
        
        // $addToSet : ajoute uniquement si la valeur n'existe pas déjà
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { favorites: pokemonId } },
            { new: true }  // Retourne le document mis à jour
        );
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/auth/favorites/:pokemonId
 * 
 * Retire un Pokémon des favoris de l'utilisateur
 * Utilise $pull pour retirer de l'array
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * 
 * Partie 6.A - Système de favoris
 */
router.delete('/favorites/:pokemonId', auth, async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.pokemonId);
        
        // $pull : retire toutes les occurrences de la valeur
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { favorites: pokemonId } },
            { new: true }  // Retourne le document mis à jour
        );
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/auth/favorites
 * 
 * Liste tous les Pokémon favoris de l'utilisateur
 * Retourne un tableau d'IDs de Pokémon
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * 
 * Partie 6.A - Système de favoris
 */
router.get('/favorites', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ════════════════════════════════════════════════════════════════════════════
// EXPORT DU ROUTEUR
// ════════════════════════════════════════════════════════════════════════════

export default router;

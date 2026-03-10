/**
 * ════════════════════════════════════════════════════════════════════════════
 *                          ROUTES ÉQUIPES - API REST
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Gestion CRUD des équipes de Pokémon (max 6 par équipe)
 * 
 * Fonctionnalités:
 * - Création d'équipe avec validation (1-6 Pokémon)
 * - Liste des équipes de l'utilisateur connecté
 * - Détail d'une équipe avec populate des données Pokémon
 * - Modification et suppression (sécurisées par propriétaire)
 * 
 * Toutes les routes requièrent authentification JWT
 * Base URL: /api/teams
 * 
 * Partie 6.D - Routes d'équipes Pokémon
 * ════════════════════════════════════════════════════════════════════════════
 */

import express from 'express';
import Team from '../models/Team.js';
import Pokemon from '../models/Pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ════════════════════════════════════════════════════════════════════════════
//                         ROUTES CRUD (PROTÉGÉES)
// ════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/teams
 * 
 * Crée une nouvelle équipe pour l'utilisateur connecté
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * Body requis:
 * - name: Nom de l'équipe
 * - pokemons: Array d'IDs de Pokémon (1-6 éléments)
 * 
 * Partie 6.D - Routes d'équipes
 */
router.post('/', auth, async (req, res) => {
    try {
        const { name, pokemons } = req.body;
        
        // ────────────────────────────────────────────────────────────────────
        // VALIDATION DU NOM
        // ────────────────────────────────────────────────────────────────────
        if (!name) {
            return res.status(400).json({ error: 'Nom de l\'équipe requis' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // VALIDATION DU NOMBRE DE POKÉMON (1-6)
        // ────────────────────────────────────────────────────────────────────
        if (!pokemons || !Array.isArray(pokemons) || pokemons.length === 0 || pokemons.length > 6) {
            return res.status(400).json({ error: 'L\'équipe doit contenir 1 à 6 Pokémon' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // CRÉATION DE L'ÉQUIPE
        // ────────────────────────────────────────────────────────────────────
        const team = new Team({
            user: req.user.id,  // Défini par le middleware auth
            name,
            pokemons
        });
        
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * GET /api/teams
 * 
 * Liste toutes les équipes de l'utilisateur connecté
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * 
 * Partie 6.D - Routes d'équipes
 */
router.get('/', auth, async (req, res) => {
    try {
        // Filtre par user : ne retourne que les équipes de l'utilisateur
        const teams = await Team.find({ user: req.user.id });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/teams/:id
 * 
 * Récupère le détail d'une équipe avec les données complètes des Pokémon
 * Utilise populate manuel via Promise.all pour récupérer chaque Pokémon
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * Sécurité: Vérifie que l'équipe appartient à l'utilisateur
 * 
 * Partie 6.D - Routes d'équipes
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        
        // ────────────────────────────────────────────────────────────────────
        // VÉRIFICATION DE L'EXISTENCE ET DU PROPRIÉTAIRE
        // ────────────────────────────────────────────────────────────────────
        if (!team || team.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // POPULATE MANUEL DES DONNÉES POKÉMON
        // ────────────────────────────────────────────────────────────────────
        // Récupère les données complètes de chaque Pokémon de l'équipe
        const detailedPokemons = await Promise.all(
            team.pokemons.map(pokemonId => Pokemon.findOne({ id: pokemonId }))
        );
        
        res.json({
            ...team.toObject(),
            pokemonsData: detailedPokemons  // Données complètes des Pokémon
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/teams/:id
 * 
 * Modifie une équipe existante
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * Body: Champs à modifier (name, pokemons)
 * Sécurité: Vérifie que l'équipe appartient à l'utilisateur
 * 
 * Partie 6.D - Routes d'équipes
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        
        // ────────────────────────────────────────────────────────────────────
        // VÉRIFICATION DE L'EXISTENCE ET DU PROPRIÉTAIRE
        // ────────────────────────────────────────────────────────────────────
        if (!team || team.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // VALIDATION DU NOMBRE DE POKÉMON
        // ────────────────────────────────────────────────────────────────────
        if (req.body.pokemons && req.body.pokemons.length > 6) {
            return res.status(400).json({ error: 'L\'équipe ne peut avoir que 6 Pokémon maximum' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // MISE À JOUR
        // ────────────────────────────────────────────────────────────────────
        const updated = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,           // Retourne le document mis à jour
                runValidators: true  // Applique les validations du schéma
            }
        );
        
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * DELETE /api/teams/:id
 * 
 * Supprime une équipe
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * Sécurité: Vérifie que l'équipe appartient à l'utilisateur
 * 
 * Partie 6.D - Routes d'équipes
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        
        // ────────────────────────────────────────────────────────────────────
        // VÉRIFICATION DE L'EXISTENCE ET DU PROPRIÉTAIRE
        // ────────────────────────────────────────────────────────────────────
        if (!team || team.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }
        
        // ────────────────────────────────────────────────────────────────────
        // SUPPRESSION
        // ────────────────────────────────────────────────────────────────────
        await Team.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ════════════════════════════════════════════════════════════════════════════
// EXPORT DU ROUTEUR
// ════════════════════════════════════════════════════════════════════════════

export default router;

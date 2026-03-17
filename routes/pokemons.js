/**
 * ════════════════════════════════════════════════════════════════════════════
 *                          ROUTES POKÉMON - API REST
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Routes CRUD complètes pour la gestion des Pokémon
 * 
 * Fonctionnalités:
 * - Liste avec filtres (type, nom), tri, pagination (Partie 4)
 * - Récupération par ID
 * - Création, Modification, Suppression (authentification requise - Partie 5)
 * - Statistiques globales et par type (agrégation MongoDB - Partie 6.B)
 * 
 * Base URL: /api/pokemons
 * ════════════════════════════════════════════════════════════════════════════
 */

import express from 'express';
import Pokemon from '../models/Pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ════════════════════════════════════════════════════════════════════════════
//                          ROUTES DE LECTURE (PUBLIQUES)
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/pokemons
 * 
 * Récupère la liste des Pokémon avec filtres, tri et pagination
 * 
 * Query params:
 * - type: Filtre par type (ex: "Fire", "Water", "Grass")
 * - name: Recherche par nom (insensible à la casse, multi-langue)
 * - sort: Tri par champ (ex: "name.english", "-base.Attack")
 * - page: Numéro de page (défaut: 1)
 * - limit: Nombre par page (défaut: 50)
 * 
 * Partie 1 & 4 - Premières routes Express + Filtres et pagination
 */
router.get('/', async (req, res) => {
    try {
        // ────────────────────────────────────────────────────────────────────
        // CONSTRUCTION DU FILTRE
        // ────────────────────────────────────────────────────────────────────
        let filter = {};
        
        // Filtre par type (ex: ?type=Fire)
        if (req.query.type) {
            filter.type = req.query.type;
        }
        
        // Recherche par nom dans les 3 langues (anglais, français, japonais)
        if (req.query.name) {
            filter.$or = [
                { 'name.english': { $regex: req.query.name, $options: 'i' } },
                { 'name.french': { $regex: req.query.name, $options: 'i' } },
                { 'name.japanese': { $regex: req.query.name, $options: 'i' } }
            ];
        }
        
        // ────────────────────────────────────────────────────────────────────
        // TRI
        // ────────────────────────────────────────────────────────────────────
        let sortQuery = {};
        if (req.query.sort) {
            // Gère le préfixe "-" pour tri décroissant (ex: -base.Attack)
            const sortField = req.query.sort.startsWith('-') ? req.query.sort.slice(1) : req.query.sort;
            const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
            sortQuery = { [sortField]: sortOrder };
        }
        
        // ────────────────────────────────────────────────────────────────────
        // PAGINATION
        // ────────────────────────────────────────────────────────────────────
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 50);
        const skip = (page - 1) * limit;
        
        // ────────────────────────────────────────────────────────────────────
        // REQUÊTE MONGODB
        // ────────────────────────────────────────────────────────────────────
        const pokemons = await Pokemon.find(filter)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);
        
        // Calcul du nombre total de pages
        const total = await Pokemon.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        
        res.json({
            data: pokemons,
            page,
            limit,
            total,
            totalPages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/pokemons/:id
 * 
 * Récupère un Pokémon spécifique par son ID (1-151)
 * 
 * Partie 1 - Premières routes Express
 */
router.get('/:id', async (req, res) => {
    try {
        const pokemon = await Pokemon.findOne({ id: parseInt(req.params.id) });
        
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }
        
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ════════════════════════════════════════════════════════════════════════════
//              ROUTES DE MODIFICATION (AUTHENTIFICATION REQUISE)
// ════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/pokemons
 * 
 * Crée un nouveau Pokémon
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * Body: Objet Pokémon complet (id, name, type, base, image)
 * 
 * Partie 3 & 5 - CRUD complet + Authentification JWT
 */
router.post('/', auth, async (req, res) => {
    try {
        const pokemon = new Pokemon(req.body);
        await pokemon.save();
        
        res.status(201).json(pokemon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * PUT /api/pokemons/:id
 * 
 * Modifie un Pokémon existant
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * Body: Champs à modifier (partiel possible)
 * 
 * Partie 3 & 5 - CRUD complet + Authentification JWT
 */
router.put('/:id', auth, async (req, res) => {
    try {
        const pokemon = await Pokemon.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { 
                new: true,           // Retourne le document modifié
                runValidators: true  // Applique les validations du schéma
            }
        );
        
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }
        
        res.json(pokemon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * DELETE /api/pokemons/:id
 * 
 * Supprime un Pokémon
 * 
 * Requiert: Header "Authorization: Bearer <token>"
 * 
 * Partie 3 & 5 - CRUD complet + Authentification JWT
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const pokemon = await Pokemon.findOneAndDelete({ id: parseInt(req.params.id) });
        
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ════════════════════════════════════════════════════════════════════════════
//                    ROUTES DE STATISTIQUES (PUBLIQUES)
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/pokemons/stats/overview
 * 
 * Statistiques globales sur tous les Pokémon
 * Utilise l'agrégation MongoDB pour calculer :
 * - Nombre total de Pokémon
 * - Moyennes des statistiques (HP, Attack, Defense)
 * - Valeurs maximales (HP, Attack)
 * 
 * Partie 6.B - Statistiques avancées avec agrégation
 */
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await Pokemon.aggregate([
            {
                $group: {
                    _id: null,                              // Tous les documents groupés ensemble
                    totalPokemons: { $sum: 1 },             // Compte
                    avgHP: { $avg: '$base.HP' },            // Moyenne HP
                    avgAttack: { $avg: '$base.Attack' },    // Moyenne Attack
                    avgDefense: { $avg: '$base.Defense' },  // Moyenne Defense
                    maxAttack: { $max: '$base.Attack' },    // Attack max
                    maxHP: { $max: '$base.HP' }             // HP max
                }
            }
        ]);
        
        res.json(stats[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/pokemons/stats/by-type
 * 
 * Statistiques par type de Pokémon
 * Utilise l'agrégation MongoDB pour calculer :
 * - Nombre de Pokémon par type
 * - Moyennes des statistiques par type
 * - Tri par nombre décroissant
 * 
 * Note: Utilise $unwind car un Pokémon peut avoir 2 types
 * 
 * Partie 6.B - Statistiques avancées avec agrégation
 */
router.get('/stats/by-type', async (req, res) => {
    try {
        const stats = await Pokemon.aggregate([
            { $unwind: '$type' },                           // Déplie le tableau de types
            {
                $group: {
                    _id: '$type',                           // Groupe par type
                    count: { $sum: 1 },                     // Compte par type
                    avgHP: { $avg: '$base.HP' },            // Moyenne HP par type
                    avgAttack: { $avg: '$base.Attack' },    // Moyenne Attack par type
                    avgDefense: { $avg: '$base.Defense' }   // Moyenne Defense par type
                }
            },
            { $sort: { count: -1 } }                        // Tri décroissant par count
        ]);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ════════════════════════════════════════════════════════════════════════════
// EXPORT DU ROUTEUR
// ════════════════════════════════════════════════════════════════════════════

export default router;

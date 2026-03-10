/**
 * ════════════════════════════════════════════════════════════════════════════
 *                       MIDDLEWARE D'AUTHENTIFICATION JWT
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Middleware Express pour protéger les routes nécessitant authentification
 * 
 * Fonctionnalités:
 * - Extraction du token JWT depuis le header Authorization
 * - Vérification de la validité du token (signature + expiration)
 * - Décodage et injection des données utilisateur dans req.user
 * - Gestion des erreurs (token manquant, invalide, expiré)
 * 
 * Utilisation:
 * - Import : import auth from './middleware/auth.js'
 * - Route protégée : router.get('/protected', auth, handler)
 * 
 * Partie 5 - Authentification JWT & Protection des routes
 * ════════════════════════════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';

/**
 * Middleware d'authentification JWT
 * 
 * Vérifie la présence et validité d'un token JWT dans le header Authorization
 * Format attendu: "Authorization: Bearer <token>"
 * 
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Callback pour passer au middleware suivant
 * 
 * En cas de succès:
 * - Ajoute req.user avec { id, username, firstName, lastName }
 * - Appelle next() pour continuer vers le handler de route
 * 
 * En cas d'échec:
 * - Renvoie 401 Unauthorized avec message d'erreur
 */
export default function auth(req, res, next) {
    try {
        // ────────────────────────────────────────────────────────────────────
        // EXTRACTION DU TOKEN
        // ────────────────────────────────────────────────────────────────────
        const authHeader = req.headers.authorization;
        
        // Vérifier la présence du header et le format "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant' });
        }
        
        // Extraire le token (supprimer "Bearer " = 7 caractères)
        const token = authHeader.slice(7);
        
        // ────────────────────────────────────────────────────────────────────
        // VÉRIFICATION ET DÉCODAGE DU TOKEN
        // ────────────────────────────────────────────────────────────────────
        // jwt.verify() vérifie la signature et l'expiration
        // Lève une erreur si invalide ou expiré
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ────────────────────────────────────────────────────────────────────
        // INJECTION DES DONNÉES UTILISATEUR
        // ────────────────────────────────────────────────────────────────────
        // decoded contient : { id, username, firstName, lastName, iat, exp }
        req.user = decoded;
        
        // Passer au middleware/handler suivant
        next();
    } catch (error) {
        // Token invalide, expiré, ou erreur de vérification
        res.status(401).json({ error: 'Token invalide ou expiré' });
    }
}

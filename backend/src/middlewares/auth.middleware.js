const jwtUtil = require('../utils/jwt');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

        const decoded = jwtUtil.verifyToken(token);
        const user = await User.findByPk(decoded.id);
        
        if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

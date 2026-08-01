import { verifyToken } from '../utils/auth.js';
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = payload;
    return next();
}

import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET;
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    }
    catch (error) {
        throw new Error('Token verification failed');
    }
};
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = verifyToken(token);
        req.workspaceId = decoded.workspaceId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
//# sourceMappingURL=auth.js.map
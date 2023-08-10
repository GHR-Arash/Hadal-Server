import { Request,Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const SECRET_KEY = 'YOUR_SECRET_KEY';  // Same secret key used for signing

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Token verification failed');
    }
};

export const authenticate = (req: Request, res:Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = verifyToken(token);
        req.workspaceId = (decoded as any).workspaceId;  // or whatever payload you stored in the token
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

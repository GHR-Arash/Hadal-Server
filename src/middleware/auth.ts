import { Request,Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.JWT_SECRET;  // Same secret key used for signing

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Token verification failed');
    }
};

export const authenticate = (req: Request, res:Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        console.log(`decode token:${JSON.stringify(decoded)}`);
        console.log(`workspaceId:${(decoded as any).workspaceId}`);
        req.workspaceId = (decoded as any).workspaceId;  // or whatever payload you stored in the token
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

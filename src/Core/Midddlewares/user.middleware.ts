import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../DAL/models/user.model';
import { CustomRequest } from '../../type/custome-request';

interface JwtPayload {
    id: number; 
    role: string;
}

export const useAuth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log("useAuth middleware", useAuth);

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        res.status(401).json({
            message: `Token not found!`,
        });
        return;
    }

    const access_token = req.headers.authorization.split(" ")[1];
    if (!access_token) {
        res.status(401).json({
            message: `Token not found!`,
        });
        return;
    }

    try {
        const jwtResult = jwt.verify(access_token, process.env.JWT_SECRET!) as JwtPayload;

        if (!jwtResult || !jwtResult.id) {
            res.status(401).json({ message: `Invalid token!` });
            return;
        }

        const user = await User.findOneBy({ id: jwtResult.id });

        if (!user) {
            res.status(401).json({ message: `User not found..` });
            return;
        }

        req.user = user;
        next();
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error,
        });
    }
};

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AccessTokenPayload{
    userId: string;
}

export interface AuthenticatedRequest extends Request{
    user?: {
        userId: string;
    }
}

function getJWTSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return secret;
}



// const JWT_SECRET = process.env.JWT_SECRET!;


export function authMiddleWare(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const token = req.cookies?.access_token;
console.log("Access token from cookies:", token);
    if(!token){
        res.status(401).json({success: false, message: "You are not loggedIn"});
        return;
    }

    try{

        console.log("hii thisis abhishek")
        const payload = jwt.verify(token, getJWTSecret()) as AccessTokenPayload;
        req.user = {userId: payload.userId};
        next();
        
    } catch(error){
        res.status(401).json({
            success: false,
            message: "Expired authentication token"
        })
    }

    

    
}
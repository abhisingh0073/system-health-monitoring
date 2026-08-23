import jwt from "jsonwebtoken";



export interface AccessTokenPayload{
    userId: string;
}

export function generateAccessToken(userId: string): string{
    const JWT_SECRET = process.env.JWT_SECRET;

    if(!JWT_SECRET){
        throw new Error("JWT_SECRET is not configured");
    }
    
    return jwt.sign({userId,}, JWT_SECRET, {expiresIn: "1d",});
}
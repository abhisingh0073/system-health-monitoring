import jwt from "jsonwebtoken";

export interface AccessTokenPayload{
    userId: string;
}

function getJWTSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return secret;
}


export function generateAccessToken(userId: string): string{
    
    return jwt.sign({userId}, getJWTSecret(), {expiresIn: "1d",});
}
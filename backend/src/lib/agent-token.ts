import crypto from "crypto";


export function generateAgentToken(): string{
    return crypto.randomBytes(32).toString("hex");
}
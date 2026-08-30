import crypto from "crypto";

export function generateEnrollmentToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export function hashEnrollmentToken(token: string): string{
    return crypto.createHash("sha256").update(token).digest("hex");
}
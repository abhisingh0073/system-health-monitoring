import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}


export function comparePassword(password: string, passwordHash: string): Promise<boolean>{
    const isMatch = bcrypt.compare(password, passwordHash);
    return isMatch;
}
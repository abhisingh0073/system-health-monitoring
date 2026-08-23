import { pool } from "../db";

export async function userExistsByEmail(email: string): Promise<boolean>{

    const result = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    return result.rowCount !== null && result.rowCount > 0;
}


export async function registerUser(name: string, email: string, password: string){
    try{
        const user = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email', [name, email, password]);

        return user.rows[0];

    } catch(error){
        console.error("Error registering user: ", error);
        throw new Error("Failed to register user");
    }
}


export async function getUserByEmail(email: string){
    const result = await pool.query(
        `SELECT id, name, password, created_at
        FROM users
        WHERE email=$1 LIMIT 1`, [email]
    );

    return result.rows[0] ?? null;
}


export async function getUserById(id: string){
    const result = await pool.query(
        `SELECT id, name, email, created_at
        FROM users WHERE id = $1`, [id]
    )

    return result.rows[0] ?? null;
}


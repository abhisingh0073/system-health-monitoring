import { pool } from "../db";



export async function offlineCheck() {
    try{

        const result = await pool.query(
                        `UPDATE servers SET status = 'offline'
                        WHERE last_seen < NOW() - INTERVAL '2 minutes'
                        AND status = 'online'
                        `
                    );

        return result.rowCount;
    } catch(error){
        console.error("something went wrong");
    }
}
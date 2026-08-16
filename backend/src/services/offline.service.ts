import { pool } from "../db";
import { emitServerOffline } from "../socket/emitter";

const OFFLINE_THRESHOLD_SECONDS = Number(process.env.OFFLINE_THRESHOLD_SECONDS || "30");

export async function offlineCheck() {
    try{

        const result = await pool.query(
                        `UPDATE servers SET status = 'offline'
                        WHERE last_seen < NOW() - INTERVAL '${OFFLINE_THRESHOLD_SECONDS} seconds'
                        AND status = 'online' 
                        RETURNING id, hostname, last_seen
                        `
                    );
        
        for(const server of result.rows){
            emitServerOffline({
                serverId: server.id,
                hostname: server.hostname,
                lastSeen: server.last_seen,
            });
        }

        return result.rowCount ?? 0;
    } catch(error){
        console.error("something went wrong checking for offline servers", error);
    }
}
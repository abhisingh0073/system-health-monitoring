import { pool } from '../db';

export async function postMetrics(serverId: string, cpuUsage: number, memoryUsage: number, diskUsage: number, uptimeSeconds: number, networkIn:Number, networkOut: Number): Promise<number> {
    try{
        const metricsResult = await pool.query(
          `INSERT INTO metrics
            ( server_id, cpu_usage, memory_usage, disk_usage, uptime_seconds, network_in, network_out )
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                  [
                    serverId,
                    cpuUsage,
                    memoryUsage,
                    diskUsage,
                    uptimeSeconds,
                    networkIn,
                    networkOut
                  ]);
             
            await pool.query(
                "UPDATE servers SET last_seen = NOW(), status = 'online' WHERE id = $1", [serverId]);

        return metricsResult.rows[0].id;
        
    } catch (error) {
        console.error("Error inserting metrics:", error);
        throw new Error("Internal server error");
    } 
}